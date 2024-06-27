'use client';
import { useQuery } from '@tanstack/react-query';
import { usePathname, useRouter } from 'next/navigation';

import Loading from '~/components/Loading';
import { getTrackById } from '~/services/track';
import { Modal } from './modal';

export default function TrackModal({
	params: { id: trackId },
}: {
	params: { id: string };
}) {
	const router = useRouter();
	const { data: track, isPending } = useQuery({
		queryKey: ['track', trackId],
		queryFn: () => getTrackById(trackId),
		enabled: !!trackId,
	});

	if (isPending) return <Loading />;
	if (!track) return router.back();

	return <Modal track={track} />;
}
