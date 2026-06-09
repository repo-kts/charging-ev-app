import type { Station, StationUpsertInput } from '@trio/shared/station';
import type { Media } from '@trio/shared/blog';
import { api } from '@/lib/axios';

export async function listStations(): Promise<Station[]> {
    const { data } = await api.get('/api/admin/stations');
    return data;
}

// Reuses the shared media upload endpoint (multipart, field `file`) — same as the blog uploader.
// Returns a Media with a public `url` (+ `thumbUrl`) we attach to the station's images array.
export async function uploadStationImage(
    file: File,
    onProgress?: (pct: number) => void,
): Promise<Media> {
    const fd = new FormData();
    fd.append('file', file);
    const { data } = await api.post('/api/admin/media/upload', fd, {
        timeout: 5 * 60 * 1000,
        onUploadProgress: (evt) => {
            if (!onProgress || !evt.total) return;
            onProgress(Math.round((evt.loaded / evt.total) * 100));
        },
    });
    return data;
}

export async function createStation(input: StationUpsertInput): Promise<Station> {
    const { data } = await api.post('/api/admin/stations', input);
    return data;
}

export async function updateStation(id: string, input: StationUpsertInput): Promise<Station> {
    const { data } = await api.patch(`/api/admin/stations/${id}`, input);
    return data;
}

export async function toggleStation(id: string, enabled: boolean): Promise<Station> {
    const { data } = await api.patch(`/api/admin/stations/${id}/toggle`, { enabled });
    return data;
}

export async function deleteStation(id: string): Promise<void> {
    await api.delete(`/api/admin/stations/${id}`);
}
