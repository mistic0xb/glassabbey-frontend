export default function formatDate(dateStr?: string) {
    if (!dateStr) return 'No target set'
    return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
}