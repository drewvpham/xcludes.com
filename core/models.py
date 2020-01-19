from django.db.models.signals import post_save
from django.conf import settings
from django.db import models
from django.db.models import Sum
from django.shortcuts import reverse
from django_countries.fields import CountryField
import stripe

# from django.contrib.auth import settings.AUTH_USER_MODEL
from django_extensions.db.fields import AutoSlugField
# from django.urls import reverse
from django.template.defaultfilters import slugify

CATEGORY_CHOICES = (
    ('S', 'Shirt'),
    ('SW', 'Sport wear'),
    ('OW', 'Outwear')
)

LABEL_CHOICES = (
    ('P', 'primary'),
    ('S', 'secondary'),
    ('D', 'danger')
)

ADDRESS_CHOICES = (
    ('B', 'Billing'),
    ('S', 'Shipping'),
)


class UserProfile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    stripe_customer_id = models.CharField(max_length=50, blank=True, null=True)
    one_click_purchasing = models.BooleanField(default=False)
    image = models.ImageField(default='default.jpg', upload_to='profile_pics')
    bio = models.TextField(max_length=500, blank=True)
    location = models.CharField(max_length=30, blank=True)
    favorite_videos = models.ManyToManyField('Video', blank=True)
    favorite_tags = models.ManyToManyField(
        'Tag', blank=True, related_name='favorite_tags')
    exclude_tags = models.ManyToManyField(
        'Tag', blank=True, related_name='exclude_tags')
    favorite_categories = models.ManyToManyField(
        'Category', blank=True, related_name='favorite_tags')
    exclude_categories = models.ManyToManyField(
        'Category', blank=True, related_name='exclude_tags')
    favorite_pornstars = models.ManyToManyField(
        'Pornstar', blank=True, related_name='favorite_tags')
    exclude_pornstars = models.ManyToManyField(
        'Pornstar', blank=True, related_name='exclude_tags')
    gender = models.CharField(max_length=35, null=True)
    race = models.CharField(max_length=35, null=True)
    dob = models.DateField(null=True, blank=True)
    orientation = models.CharField(max_length=35, null=True)
    follows = models.ManyToManyField(
        'self', related_name='followers', symmetrical=False, blank=True)
    friends = models.ManyToManyField(
        'self', related_name='friends_with', symmetrical=False, blank=True)
    is_active = models.BooleanField(default=True)
    is_uploader = models.BooleanField(default=False)
    one_click_purchasing = models.BooleanField(default=False)
    tokens = models.IntegerField(default=0)

    def __str__(self):
        return self.user.username


class Item(models.Model):
    title = models.CharField(max_length=100)
    price = models.FloatField()
    discount_price = models.FloatField(blank=True, null=True)
    category = models.CharField(choices=CATEGORY_CHOICES, max_length=2)
    label = models.CharField(choices=LABEL_CHOICES, max_length=1)
    slug = models.SlugField()
    description = models.TextField()
    image = models.ImageField()

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        return reverse("core:product", kwargs={
            'slug': self.slug
        })

    def get_add_to_cart_url(self):
        return reverse("core:add-to-cart", kwargs={
            'slug': self.slug
        })

    def get_remove_from_cart_url(self):
        return reverse("core:remove-from-cart", kwargs={
            'slug': self.slug
        })


class Variation(models.Model):
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    name = models.CharField(max_length=50)  # size

    class Meta:
        unique_together = (
            ('item', 'name')
        )

    def __str__(self):
        return self.name


class ItemVariation(models.Model):
    variation = models.ForeignKey(Variation, on_delete=models.CASCADE)
    value = models.CharField(max_length=50)  # S, M, L
    attachment = models.ImageField(blank=True)

    class Meta:
        unique_together = (
            ('variation', 'value')
        )

    def __str__(self):
        return self.value


class OrderItem(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.CASCADE)
    ordered = models.BooleanField(default=False)
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    item_variations = models.ManyToManyField(ItemVariation)
    quantity = models.IntegerField(default=1)

    def __str__(self):
        return f"{self.quantity} of {self.item.title}"

    def get_total_item_price(self):
        return self.quantity * self.item.price

    def get_total_discount_item_price(self):
        return self.quantity * self.item.discount_price

    def get_amount_saved(self):
        return self.get_total_item_price() - self.get_total_discount_item_price()

    def get_final_price(self):
        if self.item.discount_price:
            return self.get_total_discount_item_price()
        return self.get_total_item_price()


class Order(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.CASCADE)
    ref_code = models.CharField(max_length=20, blank=True, null=True)
    items = models.ManyToManyField(OrderItem)
    start_date = models.DateTimeField(auto_now_add=True)
    ordered_date = models.DateTimeField()
    ordered = models.BooleanField(default=False)
    shipping_address = models.ForeignKey(
        'Address', related_name='shipping_address', on_delete=models.SET_NULL, blank=True, null=True)
    billing_address = models.ForeignKey(
        'Address', related_name='billing_address', on_delete=models.SET_NULL, blank=True, null=True)
    payment = models.ForeignKey(
        'Payment', on_delete=models.SET_NULL, blank=True, null=True)
    coupon = models.ForeignKey(
        'Coupon', on_delete=models.SET_NULL, blank=True, null=True)
    being_delivered = models.BooleanField(default=False)
    received = models.BooleanField(default=False)
    refund_requested = models.BooleanField(default=False)
    refund_granted = models.BooleanField(default=False)

    '''
    1. Item added to cart
    2. Adding a billing address
    (Failed checkout)
    3. Payment
    (Preprocessing, processing, packaging etc.)
    4. Being delivered
    5. Received
    6. Refunds
    '''

    def __str__(self):
        return self.user.username

    def get_total(self):
        total = 0
        for order_item in self.items.all():
            total += order_item.get_final_price()
        if self.coupon:
            total -= self.coupon.amount
        return total


class Address(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.CASCADE)
    street_address = models.CharField(max_length=100)
    apartment_address = models.CharField(max_length=100)
    country = CountryField(multiple=False)
    zip = models.CharField(max_length=100)
    address_type = models.CharField(max_length=1, choices=ADDRESS_CHOICES)
    default = models.BooleanField(default=False)

    def __str__(self):
        return self.user.username

    class Meta:
        verbose_name_plural = 'Addresses'


class Payment(models.Model):
    stripe_charge_id = models.CharField(max_length=50)
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.SET_NULL, blank=True, null=True)
    amount = models.FloatField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.user.username


class Coupon(models.Model):
    code = models.CharField(max_length=15)
    amount = models.FloatField()

    def __str__(self):
        return self.code


class Refund(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    reason = models.TextField()
    accepted = models.BooleanField(default=False)
    email = models.EmailField()

    def __str__(self):
        return f"{self.pk}"


def userprofile_receiver(sender, instance, created, *args, **kwargs):
    if created:
        userprofile = UserProfile.objects.create(user=instance)


post_save.connect(userprofile_receiver, sender=settings.AUTH_USER_MODEL)


class Tag(models.Model):
    name = models.CharField(max_length=35)
    slug = models.CharField(max_length=250)
    created_at = models.DateTimeField(auto_now_add=False)

    def __str__(self):
        return self.name


class Category(models.Model):
    name = models.CharField(max_length=35)
    slug = models.CharField(max_length=250)
    created_at = models.DateTimeField(auto_now_add=False)
    image = models.ImageField(default='default.jpg', upload_to='categories')

    def __str__(self):
        return self.name


class Pornstar(models.Model):
    name = models.CharField(max_length=35)
    slug = models.CharField(max_length=250)
    created_at = models.DateTimeField(auto_now_add=False)

    def __str__(self):
        return self.name


class Video(models.Model):
    title = models.CharField(max_length=500)
    slug = AutoSlugField(populate_from="title")
    description = models.CharField(max_length=500)
    videofile = models.FileField(upload_to='videos/', null=True)
    thumbnail = models.ImageField()
    uploader = models.ForeignKey(
        settings.AUTH_USER_MODEL, null=True, on_delete=models.SET_NULL)
    created_at = models.DateTimeField(auto_now_add=True, blank=False)
    modified_at = models.DateTimeField(auto_now=True)
    private = models.BooleanField(default=True)
    tags = models.ManyToManyField(Tag, blank=True, null=True)

    def __str__(self):
        return self.title + ": " + str(self.videofile)

    def get_absolute_url(self):
        return reverse('videos:detail', kwargs={
            'slug': self.slug
        })


class Rating(models.Model):
    score = models.IntegerField(null=True)
    video = models.ForeignKey(Video, on_delete=models.CASCADE)
    reviewer = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE)


class Comment(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             null=True, on_delete=models.SET_NULL)
    video = models.ForeignKey(Video, on_delete=models.CASCADE)
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class LikedVideos(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             null=True, on_delete=models.SET_NULL)
    video = models.ForeignKey(Video, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)


class SavedVideos(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             null=True, on_delete=models.SET_NULL)
    video = models.ForeignKey(Video, on_delete=models.CASCADE)
    watched_at = models.DateTimeField(auto_now_add=True)


class WatchedVideos(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             null=True, on_delete=models.SET_NULL)
    video = models.ForeignKey(Video, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)


class Chat(models.Model):
    admin = models.ForeignKey(settings.AUTH_USER_MODEL,
                              null=True, on_delete=models.SET_NULL)
    participants = models.ManyToManyField(
        settings.AUTH_USER_MODEL, related_name='chats')
    created_at = models.DateTimeField(auto_now_add=True)


class Message(models.Model):
    chat = models.ForeignKey(
        Chat, on_delete=models.CASCADE, related_name='messages')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, null=True,
                             on_delete=models.SET_NULL, related_name='sender')
    recipient = models.ForeignKey(settings.AUTH_USER_MODEL, null=True,
                                  on_delete=models.SET_NULL, related_name='receiver')
    subject = models.CharField(max_length=35)
    text = models.TextField(max_length=500)
    created_at = models.DateTimeField(auto_now_add=True)


MEMBERSHIP_CHOICES = (
    ('Premium Monthly', 'premium monthly'),
    ('Premium Yearly', 'premium yearly'),
    ('Free', 'free')
)


class Membership(models.Model):
    slug = models.SlugField()
    membership_type = models.CharField(
        choices=MEMBERSHIP_CHOICES,
        default='Free',
        max_length=30)
    price = models.IntegerField(default=0)
    stripe_plan_id = models.CharField(max_length=40)
    # billing_frequency = models.CharField(max_length=40, null=True, blank=True)

    def __str__(self):
        return self.membership_type


class UserMembership(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    stripe_customer_id = models.CharField(max_length=40)
    membership = models.ForeignKey(
        Membership, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return self.user.username


def post_save_usermembership_create(sender, instance, created, *args, **kwargs):
    user_membership, created = UserMembership.objects.get_or_create(
        user=instance)

    if user_membership.stripe_customer_id is None or user_membership.stripe_customer_id == '':
        new_customer_id = stripe.Customer.create(email=instance.email)
        try:
            free_membership = Membership.objects.get(membership_type='Free')
        except Membership.DoesNotExist:
            free_membership = None
        user_membership.stripe_customer_id = new_customer_id['id']
        user_membership.membership = free_membership
        user_membership.save()


post_save.connect(post_save_usermembership_create,
                  sender=settings.AUTH_USER_MODEL)


class Subscription(models.Model):
    user_membership = models.ForeignKey(
        UserMembership, on_delete=models.CASCADE)
    stripe_subscription_id = models.CharField(max_length=40)
    active = models.BooleanField(default=True)

    def __str__(self):
        return self.user_membership.user.username

    @property
    def get_created_date(self):
        subscription = stripe.Subscription.retrieve(
            self.stripe_subscription_id)
        return datetime.fromtimestamp(subscription.created)

    @property
    def get_next_billing_date(self):
        subscription = stripe.Subscription.retrieve(
            self.stripe_subscription_id)
        return datetime.fromtimestamp(subscription.current_period_end)


class Contest(models.Model):
    title = models.CharField(max_length=500)
    slug = models.SlugField()
    open_date = models.DateTimeField(
        ("Starting Date"), help_text='Date entries open', blank=True, null=True)
    close_date = models.DateTimeField(
        ("Ending Date"), help_text='Date entries close', blank=True, null=True)
    award_date = models.DateTimeField(
        ("Award Date"), help_text='Date prizes are awarded', blank=True, null=True)
    instant_win = models.BooleanField(("Instant Win"), default=False)
    instant_win_odds = models.IntegerField(
        ("Instant Win Odds"), help_text='1 in ____. Enter whole number', blank=True, null=True)
    daily = models.BooleanField(("Daily Prizes"), default=False,
                                help_text="A new winner can be won daily")
    winner = models.ForeignKey(
        settings.AUTH_USER_MODEL, null=True, on_delete=models.SET_NULL)
    # code_type = models.CharField(("Code Type"), default="none", choices=CODE_TYPES, max_length=30)

    class Meta:
        verbose_name = ("Contest")
        verbose_name_plural = ("Contests")

    def __str__(self):
        return '%s' % self.title


class Code(models.Model):
    code = models.CharField(
        "Code", max_length=100, help_text='A code that has to be present at time of submission')
    contest = models.ForeignKey(Contest, null=True, on_delete=models.SET_NULL)

    class Meta:
        verbose_name = ("Code")
        verbose_name_plural = ("Codes")

    def __unicode__(self):
        return '%s' % self.code


class Prize(models.Model):
    name = models.CharField(("Prize"), max_length=150)
    description = models.TextField(("Description"), default="")
    image = models.ImageField(
        ("Image"), upload_to='contest/prizes', blank=True, null=True)
    date_available = models.DateField(
        ("Date Prize is Available"), blank=True, help_text="Date that the prize is to be awarded")
    number_available = models.IntegerField(
        ("Number Available"), default=1, blank=True)
    contest = models.ForeignKey(Contest, null=True, on_delete=models.SET_NULL)

    class Meta:
        verbose_name = ("Prize")
        verbose_name_plural = ("Prizes")

    def __str__(self):
        return '%s' % self.name


class Entry(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    code = models.CharField(("Code"), max_length=25, blank=True, null=True)
    contest = models.ForeignKey(Contest, on_delete=models.SET_NULL, null=True)
    winner = models.BooleanField(("Winner"), default=False)

    def __str__(self):
        return 'entry for: %s %s' % (self.user, self.contest)

    def get_user(self):
        return self.user.username
