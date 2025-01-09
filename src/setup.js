// src/__tests__/setup.js
import { connectDB } from "../config/database";
import { testUtils } from "../utils/testUtils";

beforeAll(async () => {
  await connectDB();
});

afterEach(async () => {
  await testUtils.clearTestData();
});

afterAll(async () => {
  await mongoose.connection.close();
});
