import NextAuth from "next-auth";

import { getAuthOptions } from "../../../lib/auth";

export default NextAuth(getAuthOptions());
