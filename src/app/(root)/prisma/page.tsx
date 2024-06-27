'use client';
import { useMutation, useQuery } from '@tanstack/react-query';

type Track = {
  artist: string;
  duration_ms: number;
  explicit: boolean;
  external_urls: string;
  id: number;
  name: string;
  preview_url: string;
  track_id: string;
  type: string;
}
type User = {
  name: string;
  email: string;
  savedTracks: {
    track_id: number,
    track: Track
  }[]
}
type Data = {
  user: User;
  tracks: Track[];
};
const getUser = async () => {
  const data = await fetch('/api/prisma');
  if (!data.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data');
  }
  const result = await data.json();
  return result;
};
export default function PrismaPage() {
  const { data, isLoading, isError, error } = useQuery<Data>({
    queryKey: ['user'],
    queryFn: getUser,
  });
  const mutation = useMutation({
    mutationFn: async ({ body }: { body: { user: User, track_id: number } }) => {
      return await fetch(`/api/saved`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    },
  })
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error: {error!.message}</div>;
  }
  if (!data) return null;
  const { user, tracks } = data;
  const addCollection = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    mutation.mutate({ body: { user, track_id: 1 } })
    try {
      /* const body = { user, track_id: 1 }
      return await fetch(`/api/saved`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }); */

    } catch (error) {
      console.error(error);
    }
  };
  const onDelete = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const body = { user, track_id: 1 };
      await fetch(`/api/saved`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-900'>
      <div>
        <h1>All tracks</h1>
        {tracks.map(track => {
          return (
            <div key={track.id} className='flex flex-row items-center justify-center'>
              <p>{track.name}</p> 	&nbsp;{'-'}	&nbsp;
              <p>{track.artist}</p>
            </div>
          );
        })}
      </div>
      <button onClick={addCollection}>Send</button>
      <button onClick={onDelete}>Delete</button>
      <div>
        <h1>User</h1>
        <p>{user.name}</p>
        <p>{user.email}</p>
      </div>
      <div>
        <h1>User saved tracks</h1>
        {
          user.savedTracks.map(track => {
            return (
              <div key={track.track_id} className='flex flex-row items-center justify-center'>
                <p>{track.track.name}</p> 	&nbsp;{'-'}	&nbsp;
                <p>{track.track.artist}</p>
              </div>
            );
          })
        }
      </div>

    </div>
  );
}
