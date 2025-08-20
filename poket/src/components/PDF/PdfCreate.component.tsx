import { Button, Icon } from "@mui/material";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import logoGs from "../../assets/logoCorrea.png";
import { IResponseInfoPedido } from "../../interfaces/pedidos.interface";

interface Props {
  dataPedido: IResponseInfoPedido | undefined;
}

export default function DescargarPDF({ dataPedido }: Props) {
  const handleDownloadPDF = () => {
    if (!dataPedido) return;

    const { pedido, articulos } = dataPedido;

    const doc = new jsPDF();

    // Cargar imagen
    const img = new Image();
    img.src = logoGs;

    const totalGeneral = articulos.reduce(
      (acc, art) => acc + Number(art.total),
      0
    );

    img.onload = () => {
        // --- LOGO ---
        doc.addImage(img, "PNG", 14, 10, 38, 30);

        // --- TÍTULO ---
        doc.setFontSize(20);
        doc.setFont("helvetica", "bold");
        doc.text("Comercializadora Correa", 60, 28);

        // =========================
        // INFO DEL PEDIDO COMO TABLA
        // =========================
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text("Detalles del Pedido:", 14, 45);

        autoTable(doc, {
            startY: 50,
            theme: "plain",
            styles: { 
                fontSize: 11, 
                cellPadding: 3, 
                lineWidth: 0.1,        
                lineColor: [0, 0, 0],  
            },
            columnStyles: {
                0: { fontStyle: "bold", fillColor: [210, 210, 210], halign: "left" },
                1: { halign: "left", fillColor: [230, 230, 230] },
            },
            body: [
                ["Pedido:", `#${pedido.id}`],
                ["Cliente:", pedido.cliente_nombre],
                ["Teléfono:", pedido.cliente_telefono ?? "N/A"],
                ["Creado por:", pedido.Creado_por],
                ["Estado del pedido:", pedido.estado],
                ["Fecha de creación:", new Date(pedido.fecha_creacion).toLocaleString()],
                ...(pedido.comentarios ? [["Comentarios", pedido.comentarios]] : []),
            ],
        });

        // =========================
        // TABLA DE ARTÍCULOS
        // =========================
        // Tomamos la Y donde terminó la tabla anterior
        const startYArticulos = (doc as any).lastAutoTable?.finalY || 60;

        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text(`Productos totales (${articulos.length})`, 14, startYArticulos + 10);

        autoTable(doc, {
            startY: startYArticulos + 15, // deja espacio entre subtítulo y tabla
            head: [[ "Producto", "Precio Unitario", "Cantidad", "Total"]],
            body: articulos.map((art) => [
                art.descripcion,
                `$${Number(art.precio_unitario).toFixed(2)}`,
                art.cantidad,
                `$${Number(art.total).toFixed(2)}`,
            ]),
            headStyles: { fillColor: [35, 69, 150], textColor: 255, fontStyle: "bold", cellPadding:2 },
            foot: [
                [
                { content: "TOTAL GENERAL", colSpan: 3, styles: { halign: "left", fontStyle: "bold", cellPadding:3 } },
                { content: `$${totalGeneral.toFixed(2)}`, styles: { halign: "right", fontStyle: "bold", cellPadding:3 } },
                ],
            ],
        });

      // --- DESCARGAR PDF ---
      doc.save(`Pedido - #${pedido.id}.pdf`);
    };
  };

  return (
    <Button
      type="button"
      variant="contained"
      startIcon={<Icon>picture_as_pdf</Icon>}
      sx={{ bgcolor: "error.main", color: "white", mb: 2, mt: 2 }}
      onClick={handleDownloadPDF}
    >
      Descargar PDF
    </Button>
  );
}
