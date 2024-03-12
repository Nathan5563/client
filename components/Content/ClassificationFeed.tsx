import React, { useEffect, useState } from "react";
import { useSession, useSupabaseClient, SupabaseClient } from "@supabase/auth-helpers-react";
import CardForum, { CommentItem, RoverContentCard } from "./DiscussCard";

export default function ClassificationFeed({ custommaxWidth = '85%' }) {
  const supabase = useSupabaseClient();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
      fetchPosts();
  }, []);

  async function fetchPosts() {
      try {
          const postsResponse = await supabase
              .from("basePlanets")
              .select(
                  "id, content, created_at, planets2, planetsss(id, temperature), profiles(id, avatar_url, full_name, username)"
              )
              .order('created_at', { ascending: false });

          const roverImagePostsResponse = await supabase
              .from("contentROVERIMAGES")
              .select("id, content, created_at")
              .order('created_at', { ascending: false });

          const combinedPosts = [...postsResponse.data, ...roverImagePostsResponse.data];

          const sortedPosts = combinedPosts.sort((a, b) =>
              new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );

          setPosts(sortedPosts);
      } catch (error) {
          console.error("Error fetching posts:", error.message);
      }
  }

  return (
      <ul
          aria-label="Nested user feed"
          role="feed"
          className="relative flex flex-col gap-12 py-12 before:absolute before:top-0 before:left-8 before:h-full before:-translate-x-1/2 after:absolute after:top-6 after:left-8 after:bottom-6 after:-translate-x-1/2"
          style={{ maxWidth: custommaxWidth, margin: 'auto' }}
      >
          {posts.map((post) => (
              <li key={post.id} role="article" className="relative">
                  <CardForum {...post} />
              </li>
          ))}
      </ul>
  );
}

export function FactionFeed({ custommaxWidth = '85%', factionId }) {
  const supabase: SupabaseClient = useSupabaseClient();
  const session = useSession();

  const [posts, setPosts] = useState([]);
  // const [profile, setProfile] = useState(null);
  const [planetPosts, setPlanetPosts] = useState([]);

  useEffect(() => {
      fetchPosts();
    }, []);  
  
  useEffect(() => {
      if (planetPosts.length > 0) {
        console.log("Comments: ", planetPosts.flatMap((post) => post.comments));
      }
  }, []);

  async function fetchPosts() {
      const postsResponse = await supabase
      .from("posts_duplicates")
      .select(
        "id, content, created_at, planets2, faction, planetsss(id, temperature), profiles(id, avatar_url, full_name, username)"
      )
      .eq('faction', factionId)
      .order('created_at', { ascending: false });
  
    const postIds = postsResponse.data.map((post) => post.id);
    const commentsResponse = await supabase
      .from("comments")
      .select("id, content, created_at, profiles(id, avatar_url, username), post_id") // Add the closing parenthesis for profiles select
      .in("post_id", postIds)
      .order("created_at", { ascending: true });

    const commentsByPostId: { [postId: number]: Comment[] } = commentsResponse.data.reduce((acc, comment) => {
      const postId = comment.post_id;
      if (!acc[postId]) {
        acc[postId] = [];
      }
      acc[postId].push(comment);
      return acc;
    }, {});

    // const postsWithComments: Post[] = postsResponse.data.map((post) => ({
    const postsWithComments = postsResponse.data.map((post) => ({
      ...post,
      comments: commentsByPostId[post.id] || [],
    }));

    setPosts(postsWithComments);
  }

  return (
    <ul
      aria-label="Nested user feed"
      role="feed"
      className="relative flex flex-col gap-12 py-12 pl-8 before:absolute before:top-0 before:left-8 before:h-full before:-translate-x-1/2 after:absolute after:top-6 after:left-8 after:bottom-6 after:-translate-x-1/2"
      style={{ maxWidth: custommaxWidth, margin: 'auto' }}
    >
      {posts.map((post) => (
        <li key={post.id} role="article" className="relative">
          <RoverContentCard {...post} />
        </li>
      ))}
    </ul>
  );
};

export function MultiClassificationFeed({ custommaxWidth = '85%' }) {
  const supabase: SupabaseClient = useSupabaseClient();
  const session = useSession();

  const [posts, setPosts] = useState([]);
  const [planetPosts, setPlanetPosts] = useState([]);

  useEffect(() => {
      fetchPosts();
  }, []);

  useEffect(() => {
      if (planetPosts.length > 0) {
          console.log("Comments: ", planetPosts.flatMap((post) => post.comments));
      }
  }, []);

  async function fetchPosts() {
      const postsResponse = await supabase
          .from("posts_duplicates")
          .select(
              "id, content, created_at, planets2, planetsss(id, temperature), profiles(id, avatar_url, full_name, username)"
          )
          .order('created_at', { ascending: false });

      const roverImagePostsResponse = await supabase
          .from("contentROVERIMAGES")
          .select("id, content, created_at")
          .order('created_at', { ascending: false });

      const combinedPosts = [...postsResponse.data, ...roverImagePostsResponse.data];

      const sortedPosts = combinedPosts.sort((a: { created_at: string }, b: { created_at: string }) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setPosts(sortedPosts);
  }

  return (
      <ul
          aria-label="Nested user feed"
          role="feed"
          className="relative flex flex-col gap-12 py-12 before:absolute before:top-0 before:left-8 before:h-full before:-translate-x-1/2 after:absolute after:top-6 after:left-8 after:bottom-6 after:-translate-x-1/2"
          style={{ maxWidth: custommaxWidth, margin: 'auto' }}
      >
          {posts.map((post) => (
              <li key={post.id} role="article" className="relative">
                  <CardForum {...post} />
              </li>
          ))}
      </ul>
  );
}

export function ClassificationFeedForIndividualPlanet(planetId, backgroundColorSet) {
  const supabase: SupabaseClient = useSupabaseClient();
  const session = useSession();

  const [posts, setPosts] = useState([]);
  // const [profile, setProfile] = useState(null);
  const [planetPosts, setPlanetPosts] = useState([]);

  useEffect(() => {
      fetchPosts();
    }, []);  
  
  useEffect(() => {
      if (planetPosts.length > 0) {
        console.log("Comments: ", planetPosts.flatMap((post) => post.comments));
      }
  }, []);

  async function fetchPosts() {
    try {
      const postsResponse = await supabase
        .from("classifications")
        // .select("id, content, created_at, author, anomaly, basePlanets, profiles(id, avatar_url, full_name, username)")
        .select("id, created_at, content, anomaly, media, profiles(id, avatar_url, full_name, username)")
        .eq('anomaly', planetId.planetId.id)
        .order('created_at', { ascending: false });
  
      if (postsResponse.error || !postsResponse.data) {
        console.error("Error fetching posts:", postsResponse.error);
        return;
      }
  
      const postIds = postsResponse.data.map((post) => post.id);
  
      const commentsResponse = await supabase
        .from("comments")
        .select("id, content, created_at, profiles(id, avatar_url, username), post_id")
        .in("post_id", postIds)
        .order("created_at", { ascending: true });
  
      const commentsByPostId = commentsResponse.data.reduce((acc, comment) => {
        const postId = comment.post_id;
        if (!acc[postId]) {
          acc[postId] = [];
        }
        acc[postId].push(comment);
        return acc;
      }, {});
  
      const postsWithComments = postsResponse.data.map((post) => ({
        ...post,
        comments: commentsByPostId[post.id] || [],
      }));
  
      setPosts(postsWithComments);
      // console.log(posts);
    } catch (error) {
      console.error("Error fetching posts:", error.message);
    }
  }  

  return (
      <div className="flex flex-col items-center gap-4 py-5" style={{ maxWidth: '100%', margin: 'auto' }}>
          {posts.map((post) => (
              <>
                <CardForum key={post.id} {...post} backgroundColor={backgroundColorSet} />
                <p>{post.planetId}</p>
              </>
          ))}
      </div>
  );
};

export function ClassificationFeedForIndividualPlanetDuplicates(planetId) {
  const supabase: SupabaseClient = useSupabaseClient();
  const session = useSession();

  const [posts, setPosts] = useState([]);
  // const [profile, setProfile] = useState(null);
  const [planetPosts, setPlanetPosts] = useState([]);

  useEffect(() => {
      fetchPosts();
    }, []);  
  
  useEffect(() => {
      if (planetPosts.length > 0) {
        console.log("Comments: ", planetPosts.flatMap((post) => post.comments));
      }
  }, []);

  async function fetchPosts() {
    try {
      const postsResponse = await supabase
        .from("posts_duplicates")
        .select(
          "id, anomaly, content, created_at, planets2, planetsss(id, temperature), profiles(id, avatar_url, full_name, username)"
        )
        // .eq('anomaly', planetId) // 'planets2', planetId
        .order('created_at', { ascending: false });
  
      if (postsResponse.error || !postsResponse.data) {
        console.error("Error fetching posts:", postsResponse.error);
        return;
      }
  
      const postIds = postsResponse.data.map((post) => post.id);
  
      const commentsResponse = await supabase
        .from("comments")
        .select("id, content, created_at, profiles(id, avatar_url, username), post_id")
        .in("post_id", postIds)
        .order("created_at", { ascending: true });
  
      const commentsByPostId = commentsResponse.data.reduce((acc, comment) => {
        const postId = comment.post_id;
        if (!acc[postId]) {
          acc[postId] = [];
        }
        acc[postId].push(comment);
        return acc;
      }, {});
  
      const postsWithComments = postsResponse.data.map((post) => ({
        ...post,
        comments: commentsByPostId[post.id] || [],
      }));
  
      setPosts(postsWithComments);
      console.log(posts);
    } catch (error) {
      console.error("Error fetching posts:", error.message);
    }
  }  

  return (
      <div className="flex flex-col items-center gap-4 py-2" style={{ maxWidth: '100%', margin: 'auto' }}>
          {posts.map((post) => (
              <>
                <CardForum key={post.id} {...post} />
                <p>{post.planetId}</p>
              </>
          ))}
      </div>
  );
};