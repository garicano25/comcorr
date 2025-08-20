
export const formatDate = (fecha: string): string => {
    const date = new Date(fecha);

    // Opciones para formato en español
    return date.toLocaleDateString("es-MX", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    });
};