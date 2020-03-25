import React from "react";
import axios from "axios";
import { playDetailURL } from "../constants";
import { List } from "semantic-ui-react";

class InfiniteResults extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
      loading: false,
      entries: [],
      hasMore: true,
      offset: 0,
      limit: 10
    };
    window.onscroll = () => {
      const {
        loadEntries,
        state: { error, loading, hasMore }
      } = this;
      if (error || loading || !hasMore) return;
      if (
        document.documentElement.scrollHeight -
          document.documentElement.scrollTop ===
        document.documentElement.clientHeight
      ) {
        console.log("in here");
        loadEntries();
      }
    };
    this.handleClick = this.handleClick.bind(this);
  }

  componentWillMount() {
    this.loadEntries();
  }
  // + ? limits = $ { limit } & offset = $ { offset }
  loadEntries = () => {
    this.setState({ loading: true }, () => {
      const { offset, limit } = this.state;
      axios
        .get(
          `http://127.0.0.1:8000/api/infinite-api/?limit=${limit}&offset=${offset}&contest_id=1`
        )
        .then(res => {
          const newEntries = res.data.entries;
          const hasMore = res.data.has_more;
          console.log(newEntries, hasMore);
          this.setState({
            hasMore,
            loading: false,
            entries: [...this.state.entries, ...newEntries],
            offset: offset + limit
          });
        })
        .catch(err => {
          this.setState({
            error: err.message,
            loading: false
          });
        });
    });
  };

  handleClick() {
    this.loadEntries();
  }

  render() {
    const { error, hasMore, loading, entries } = this.state;

    return (
      <div style={{ overflowY: "scroll", flex: 1 }}>
        <List>
          {entries.map(entry => {
            return (
              <List.Item key={entry.id}>
                <List.Content>
                  <List.Header as="a">{entry.user}</List.Header>
                  <List.Description>Entry date: </List.Description>
                </List.Content>
              </List.Item>
            );
          })}
          {error && <div>{error}</div>}
          {loading && <div>Loading...</div>}
          {!hasMore && <div>No more results</div>}
          <button onClick={this.handleClick}>Activate Lasers</button>
        </List>
      </div>
    );
  }
}

export default InfiniteResults;
