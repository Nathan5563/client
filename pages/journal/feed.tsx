import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { Text } from '@nextui-org/react';

import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";

const JournalFeed: NextPage = () => {
    const supabase = useSupabaseClient();
    const session = useSession();

    const router = useRouter();

    const [articles, setArticles] = useState([]);
}