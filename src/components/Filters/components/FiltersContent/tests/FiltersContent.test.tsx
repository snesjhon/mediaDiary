import { mountWithContext, mountWithDrawerSuspense } from "@/src/tests";
import { Select } from "@chakra-ui/react";
import React from "react";
import FiltersContent from "../FiltersContent";
import { filterDataFixture } from "./fixtures";

const onCloseFn = jest.fn();
describe("<FiltersContent />", () => {
  beforeAll(() => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // deprecated
        removeListener: jest.fn(), // deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

  it("renders Filters Content", async () => {
    const wrapper = mountWithDrawerSuspense(
      <FiltersContent data={filterDataFixture} onClose={onCloseFn} />
    );
    expect(wrapper).resolves;
  });

  it("renders Filter Years select Options", async () => {
    const wrapper = mountWithDrawerSuspense(
      <FiltersContent data={filterDataFixture} onClose={onCloseFn} />
    );
    const selectCmpt = wrapper.find(Select);
    const allOptions = selectCmpt?.findAll("option");

    expect(allOptions?.[0]).toHaveReactProps({ value: 0 });
    expect(allOptions?.[1]).toHaveReactProps({ value: "2021" });
    expect(allOptions?.[2]).toHaveReactProps({ value: "2020" });
    expect(allOptions?.[3]).toHaveReactProps({ value: "2019" });
  });
});
