/**
 * @jest-environment jsdom
 */

import { scheduleMidnightReset, clearTasks } from "./script.js";

beforeEach(() => {
    localStorage.clear();
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2025-11-23T23:59:00")); // 11:59 PM
});

afterEach(() => {
    jest.useRealTimers();
});

test("tasks reset at midnight automatically", () => {
    localStorage.setItem(
        "dailyTasks",
        JSON.stringify([{ text: "Test task", completed: false }])
    );

    scheduleMidnightReset();

    jest.advanceTimersByTime(60 * 1000); // 60,000 ms

    const tasks = JSON.parse(localStorage.getItem("dailyTasks"));

    expect(tasks).toEqual([]); // reset happened
});
