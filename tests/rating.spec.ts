import { test, expect, Page, Locator } from "@playwright/test";
import { login } from "./testfunction";

const BASE_URL = process.env.TEST_BASE_URL ?? "http://localhost:3000";
const CUSTOMER = {
  email: process.env.TEST_CUSTOMER_EMAIL ?? "",
  password: process.env.TEST_CUSTOMER_PASSWORD ?? "",
};
const SHOP_OWNER = {
  email: process.env.TEST_SHOP_OWNER_EMAIL ?? "",
  password: process.env.TEST_SHOP_OWNER_PASSWORD ?? "",
};
const ADMIN = {
  email: process.env.TEST_ADMIN_EMAIL ?? "",
  password: process.env.TEST_ADMIN_PASSWORD ?? "",
};
const SHOP_ID = process.env.TEST_SHOP_ID ?? "";

