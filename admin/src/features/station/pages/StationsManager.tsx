import { useRef, useState } from 'react';
import {
    ArrowLeft,
    ArrowRight,
    BookOpen,
    Edit2,
    ImagePlus,
    Loader2,
    MapPin,
    Plus,
    Trash2,
    X,
    Youtube,
} from 'lucide-react';
import type { Station, StationImage, StationUpsertInput } from '@trio/shared/station';
import { STATION_IMAGES_MAX } from '@trio/shared/station';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { toast } from '@/hooks/useToast';
import { preflightFile, extractUploadError } from '@/lib/uploadError';
import { uploadStationImage } from '../api';
import {
    useCreateStationMutation,
    useDeleteStationMutation,
    useStationsQuery,
    useToggleStationMutation,
    useUpdateStationMutation,
} from '../hooks';

const EMPTY_DRAFT: StationUpsertInput = {
    name: '',
    state: '',
    lat: 0,
    lon: 0,
    kw: 50,
    connector: 'CCS',
    stalls: 2,
    tariff: 20,
    enabled: true,
    images: [],
};

export default function StationsManager() {
    const query = useStationsQuery();
    const createM = useCreateStationMutation();
    const updateM = useUpdateStationMutation();
    const toggleM = useToggleStationMutation();
    const deleteM = useDeleteStationMutation();

    const [editing, setEditing] = useState<Station | null>(null);
    const [draftOpen, setDraftOpen] = useState(false);
    const [draft, setDraft] = useState<StationUpsertInput>(EMPTY_DRAFT);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const images: StationImage[] = draft.images ?? [];
    const setImages = (next: StationImage[]) => setDraft((d) => ({ ...d, images: next }));

    const handleFiles = async (fileList: FileList | null) => {
        if (!fileList || fileList.length === 0) return;
        const current = draft.images ?? [];
        const room = STATION_IMAGES_MAX - current.length;
        if (room <= 0) {
            toast.error(`Max ${STATION_IMAGES_MAX} images per station`);
            return;
        }
        const picked = Array.from(fileList);
        const toUpload = picked.slice(0, room);
        if (picked.length > room) {
            toast.error(`Only ${room} more image${room === 1 ? '' : 's'} allowed (max ${STATION_IMAGES_MAX})`);
        }
        setUploading(true);
        const added: StationImage[] = [];
        for (const file of toUpload) {
            const problem = preflightFile(file, 'image');
            if (problem) {
                toast.error(`${file.name}: ${problem}`);
                continue;
            }
            try {
                const media = await uploadStationImage(file);
                added.push({
                    url: media.url,
                    thumbUrl: media.thumbUrl ?? undefined,
                    mediaId: media.id,
                    alt: media.alt ?? undefined,
                });
            } catch (err) {
                toast.error(`${file.name}: ${extractUploadError(err)}`);
            }
        }
        if (added.length) setImages([...(draft.images ?? []), ...added]);
        setUploading(false);
    };

    const removeImage = (idx: number) => setImages(images.filter((_, i) => i !== idx));

    const moveImage = (idx: number, dir: -1 | 1) => {
        const target = idx + dir;
        if (target < 0 || target >= images.length) return;
        const next = [...images];
        [next[idx], next[target]] = [next[target], next[idx]];
        setImages(next);
    };

    const openCreate = () => {
        setEditing(null);
        setDraft(EMPTY_DRAFT);
        setDraftOpen(true);
    };

    const openEdit = (s: Station) => {
        setEditing(s);
        setDraft({
            name: s.name,
            state: s.state,
            lat: s.lat,
            lon: s.lon,
            kw: s.kw,
            connector: s.connector,
            stalls: s.stalls,
            tariff: s.tariff,
            enabled: s.enabled,
            order: s.order,
            images: s.images ?? [],
        });
        setDraftOpen(true);
    };

    const submit = async () => {
        if (!draft.name.trim() || !draft.state.trim()) {
            toast.error('Name + state required');
            return;
        }
        if (!Number.isFinite(draft.lat) || draft.lat < -90 || draft.lat > 90) {
            toast.error('Latitude must be between -90 and 90');
            return;
        }
        if (!Number.isFinite(draft.lon) || draft.lon < -180 || draft.lon > 180) {
            toast.error('Longitude must be between -180 and 180');
            return;
        }
        if (!Number.isFinite(draft.kw) || draft.kw < 0) {
            toast.error('Power must be 0 or higher');
            return;
        }
        if (!draft.connector.trim()) {
            toast.error('Connector is required');
            return;
        }
        if (!Number.isFinite(draft.stalls) || draft.stalls < 0) {
            toast.error('Stalls must be 0 or higher');
            return;
        }
        if (!Number.isFinite(draft.tariff) || draft.tariff < 0) {
            toast.error('Rate must be 0 or higher');
            return;
        }
        try {
            if (editing) {
                await updateM.mutateAsync({ id: editing.id, input: draft });
                toast.success('Station updated');
            } else {
                await createM.mutateAsync(draft);
                toast.success('Station added');
            }
            setDraftOpen(false);
        } catch (err) {
            const e = err as { response?: { data?: { message?: string } }; message?: string };
            toast.error(e?.response?.data?.message ?? e?.message ?? 'Could not save station');
        }
    };

    const remove = async (s: Station) => {
        if (!window.confirm(`Delete ${s.name}?`)) return;
        try {
            await deleteM.mutateAsync(s.id);
            toast.success('Station deleted');
        } catch {
            toast.error('Could not delete');
        }
    };

    const stations = query.data ?? [];

    return (
        <>
            <PageHeader
                title="Stations"
                description="Charging-station markers shown on the public India map."
                actions={
                    <Button onClick={openCreate}>
                        <Plus className="h-4 w-4" />
                        Add station
                    </Button>
                }
            />

            {query.isLoading ? (
                <div className="flex h-40 items-center justify-center text-slate-400">
                    <Loader2 className="h-5 w-5 animate-spin" />
                </div>
            ) : stations.length === 0 ? (
                <EmptyState
                    icon={<MapPin className="h-6 w-6" />}
                    title="No stations yet"
                    description="Add the first station to show it on the public map."
                    action={
                        <Button onClick={openCreate}>
                            <Plus className="h-4 w-4" />
                            Add station
                        </Button>
                    }
                />
            ) : (
                <Card>
                    <CardBody className="p-0">
                        <div className="overflow-x-auto">
                        <table className="w-full min-w-[480px] text-sm">
                            <thead className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
                                <tr>
                                    <th className="px-4 py-3">Name</th>
                                    <th className="px-4 py-3">State</th>
                                    <th className="hidden px-4 py-3 md:table-cell">Lat</th>
                                    <th className="hidden px-4 py-3 md:table-cell">Lon</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stations.map((s) => (
                                    <tr key={s.id} className="border-b border-slate-100">
                                        <td className="px-4 py-3 font-medium text-slate-900">
                                            {s.name}
                                        </td>
                                        <td className="px-4 py-3 text-slate-600">{s.state}</td>
                                        <td className="hidden px-4 py-3 text-slate-600 md:table-cell">
                                            {s.lat.toFixed(4)}
                                        </td>
                                        <td className="hidden px-4 py-3 text-slate-600 md:table-cell">
                                            {s.lon.toFixed(4)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    toggleM.mutate({
                                                        id: s.id,
                                                        enabled: !s.enabled,
                                                    })
                                                }
                                            >
                                                <Badge
                                                    tone={s.enabled ? 'success' : 'muted'}
                                                    className="cursor-pointer"
                                                >
                                                    {s.enabled ? 'Enabled' : 'Disabled'}
                                                </Badge>
                                            </button>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="inline-flex gap-1">
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    onClick={() => openEdit(s)}
                                                    aria-label="Edit"
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    onClick={() => remove(s)}
                                                    aria-label="Delete"
                                                >
                                                    <Trash2 className="h-4 w-4 text-red-500" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        </div>
                    </CardBody>
                </Card>
            )}

            <Modal
                open={draftOpen}
                onClose={() => setDraftOpen(false)}
                title={editing ? 'Edit station' : 'Add station'}
            >
                <div className="space-y-3">
                    <Field label="Name (e.g., Kolkata)">
                        <Input
                            value={draft.name}
                            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                        />
                    </Field>
                    <Field label="State (e.g., West Bengal)">
                        <Input
                            value={draft.state}
                            onChange={(e) => setDraft({ ...draft, state: e.target.value })}
                        />
                    </Field>
                    <div className="rounded-md border border-emerald-100 bg-emerald-50/60 px-3 py-2 text-xs text-slate-600">
                        <p className="font-medium text-slate-700">
                            Need help getting coordinates?
                        </p>
                        <p className="mt-0.5">
                            On Google Maps, right-click a place → click the first row to copy
                            "lat, lon". Or follow a tutorial:
                        </p>
                        <div className="mt-1.5 flex flex-wrap items-center gap-3">
                            <a
                                href="https://support.google.com/maps/answer/18539"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 font-medium text-emerald-700 hover:underline"
                            >
                                <BookOpen className="h-3.5 w-3.5" />
                                Blog tutorial
                            </a>
                            <a
                                href="https://www.youtube.com/results?search_query=how+to+get+latitude+longitude+google+maps"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 font-medium text-emerald-700 hover:underline"
                            >
                                <Youtube className="h-3.5 w-3.5" />
                                YouTube tutorial
                            </a>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Latitude (-90 .. 90)">
                            <Input
                                type="number"
                                step="any"
                                min={-90}
                                max={90}
                                value={draft.lat}
                                onChange={(e) =>
                                    setDraft({ ...draft, lat: Number(e.target.value) })
                                }
                            />
                        </Field>
                        <Field label="Longitude (-180 .. 180)">
                            <Input
                                type="number"
                                step="any"
                                min={-180}
                                max={180}
                                value={draft.lon}
                                onChange={(e) =>
                                    setDraft({ ...draft, lon: Number(e.target.value) })
                                }
                            />
                        </Field>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Power (kW)">
                            <Input
                                type="number"
                                step="any"
                                min={0}
                                max={1000}
                                value={draft.kw}
                                onChange={(e) =>
                                    setDraft({ ...draft, kw: Number(e.target.value) })
                                }
                            />
                        </Field>
                        <Field label="Connector">
                            <Input
                                placeholder="e.g., CCS, CHAdeMO, Type 2"
                                value={draft.connector}
                                onChange={(e) =>
                                    setDraft({ ...draft, connector: e.target.value })
                                }
                            />
                        </Field>
                        <Field label="Stalls">
                            <Input
                                type="number"
                                step={1}
                                min={0}
                                max={100}
                                value={draft.stalls}
                                onChange={(e) =>
                                    setDraft({ ...draft, stalls: Number(e.target.value) })
                                }
                            />
                        </Field>
                        <Field label="Rates (₹/kWh)">
                            <Input
                                type="number"
                                step="any"
                                min={0}
                                max={10000}
                                value={draft.tariff}
                                onChange={(e) =>
                                    setDraft({ ...draft, tariff: Number(e.target.value) })
                                }
                            />
                        </Field>
                    </div>
                    <label className="flex items-center justify-between rounded-md border border-slate-200 px-3 py-2">
                        <span className="text-sm text-slate-700">Enabled</span>
                        <input
                            type="checkbox"
                            className="h-4 w-4 cursor-pointer accent-emerald-600"
                            checked={draft.enabled !== false}
                            onChange={(e) =>
                                setDraft({ ...draft, enabled: e.target.checked })
                            }
                        />
                    </label>

                    <Field label={`Station images (max ${STATION_IMAGES_MAX})`}>
                        <p className="-mt-0.5 mb-1.5 text-xs text-slate-500">
                            Shown as a slideshow in place of the India map on the public
                            find-stations page. Drag-free reorder with the arrows; the first image
                            shows first.
                        </p>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={(e) => {
                                void handleFiles(e.target.files);
                                e.target.value = '';
                            }}
                        />
                        {images.length > 0 && (
                            <div className="mb-2 grid grid-cols-3 gap-2 sm:grid-cols-4">
                                {images.map((img, idx) => (
                                    <div
                                        key={`${img.url}-${idx}`}
                                        className="group relative aspect-square overflow-hidden rounded-md border border-slate-200 bg-slate-50"
                                    >
                                        <img
                                            src={img.thumbUrl || img.url}
                                            alt={img.alt || `Station image ${idx + 1}`}
                                            className="h-full w-full object-cover"
                                        />
                                        {idx === 0 && (
                                            <span className="absolute left-1 top-1 rounded bg-emerald-600/90 px-1 py-0.5 text-[10px] font-semibold text-white">
                                                Cover
                                            </span>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => removeImage(idx)}
                                            aria-label="Remove image"
                                            className="absolute right-1 top-1 rounded-full bg-black/55 p-0.5 text-white opacity-0 transition group-hover:opacity-100"
                                        >
                                            <X className="h-3.5 w-3.5" />
                                        </button>
                                        <div className="absolute inset-x-0 bottom-0 flex justify-between bg-black/45 px-1 py-0.5 opacity-0 transition group-hover:opacity-100">
                                            <button
                                                type="button"
                                                onClick={() => moveImage(idx, -1)}
                                                disabled={idx === 0}
                                                aria-label="Move left"
                                                className="text-white disabled:opacity-30"
                                            >
                                                <ArrowLeft className="h-3.5 w-3.5" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => moveImage(idx, 1)}
                                                disabled={idx === images.length - 1}
                                                aria-label="Move right"
                                                className="text-white disabled:opacity-30"
                                            >
                                                <ArrowRight className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading || images.length >= STATION_IMAGES_MAX}
                        >
                            {uploading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <ImagePlus className="h-4 w-4" />
                            )}
                            {uploading
                                ? 'Uploading…'
                                : images.length === 0
                                  ? 'Upload images'
                                  : `Add more (${images.length}/${STATION_IMAGES_MAX})`}
                        </Button>
                    </Field>

                    <div className="flex justify-end gap-2 pt-2">
                        <Button variant="ghost" onClick={() => setDraftOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={submit}
                            loading={createM.isPending || updateM.isPending}
                        >
                            {editing ? 'Save' : 'Add'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <label className="block space-y-1">
            <span className="text-xs font-medium text-slate-600">{label}</span>
            {children}
        </label>
    );
}
