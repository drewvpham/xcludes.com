import React from "react";
import { shallow } from "enzyme";
import { SideBarHeader } from "../SideNavHeader";

describe("SideBarHeader", () => {
  test("renders SideBarHeader with props.title=null", () => {
    const wrapper = shallow(<SideBarHeader />);
    expect(wrapper).toMatchSnapshot();
  });

  test("renders SideBarHeader with props.title=''", () => {
    const wrapper = shallow(<SideBarHeader title="" />);
    expect(wrapper).toMatchSnapshot();
  });

  test("renders SideBarHeader with sample title", () => {
    const wrapper = shallow(<SideBarHeader title="Sample Title" />);
    expect(wrapper).toMatchSnapshot();
  });
});
