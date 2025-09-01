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
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    const gap = 10;

    const colW = (pageWidth - margin * 2 - gap) / 2;
    const xLeft = margin;
    const xRight = margin + colW + gap;

    const img = new Image();
    img.src = logoGs;

    const totalGeneral = articulos.reduce(
      (acc, art) => acc + Number(art.total),
      0
    );

    img.onload = () => {
      // --------------------------
      // Título y eslogan centrados
      // --------------------------
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(31,73,125);
      doc.text("COMERCIAL CORREA", pageWidth / 2, 18, { align: "center" });

      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(31,73,125);
      doc.text( "MAYORISTAS EN LÍNEA BLANCA, ELECTRÓNICA Y AIRE ACONDICIONADO", pageWidth / 2, 26, { align: "center" });

      // --------------------------
      // Fila 1: Logo (izq) + Pedido (der)
      // --------------------------
      const topRowY = 36;

      // LOGO (IZQUIERDA)
      const logoW = 55;
      const logoH = 40;
      doc.addImage(img, "PNG", xLeft, topRowY, logoW, logoH);
      const logoEndY = topRowY + logoH;

      // Tabla de datos del pedido (DERECHA)
      autoTable(doc, {
        startY: topRowY,
        margin: { left: xRight },
        tableWidth: colW,
        theme: "plain",
        styles: { fontSize: 10, cellPadding: 2.5 },
        columnStyles: {
          0: { fontStyle: "bold", halign: "right" },
          1: { halign: "center", lineWidth: 0.1, lineColor: [180, 180, 180] },
        },
        body: [
          ["Fecha", new Date().toLocaleDateString()],
          ["Válido hasta", "00/00/00"],
          ["Folio", String(pedido.id)],
          ["Cliente", pedido.cliente_nombre || "N/A"],
        ],
      });
      const pedidoEndY = (doc as any).lastAutoTable.finalY;

      const nextRowY = Math.max(pedidoEndY, logoEndY) + 6;

      // --------------------------
      // Fila 2: Cliente (izq) + Descripción (der)
      // --------------------------

      // Datos del Cliente (IZQUIERDA)
      autoTable(doc, {
        startY: nextRowY,
        margin: { left: xLeft },
        tableWidth: colW,
        theme: "plain",
        head: [["Datos Cliente"]],
        headStyles: { fillColor: [83, 141, 213], textColor: 255, fontStyle: "bold", halign: "center" },
        columnStyles: {0: { halign: 'center' },},
        body: [
          [(pedido.cliente_nombre || "N/A")],
          [ "Dirreccion"],
          ["Cod. Postal"],
        ],
      });
      const clienteEndY = (doc as any).lastAutoTable.finalY;

      // Descripción (DERECHA)
      autoTable(doc, {
        startY: nextRowY,
        margin: { left: xRight },
        tableWidth: colW,
        theme: "plain",
        head: [["Descripción:"]],
        headStyles: { fillColor: [83, 141, 213], textColor: 255, fontStyle: "bold", halign: "center" },
        styles: { fontSize: 10, cellPadding: 3, lineWidth: 0.1, lineColor: [180, 180, 180] },
        columnStyles: {0: { cellPadding:10 },},
        body: [[""],],
      });
      const descEndY = (doc as any).lastAutoTable.finalY;

      const startYArticulos = Math.max(descEndY, clienteEndY) + 10;

      // --------------------------
      // TABLA DE ARTÍCULOS
      // --------------------------

      autoTable(doc, {
        startY: startYArticulos,
        head: [["CANTIDAD","CODIGO","DESCRIPCIÓN", "P. UNITARIO", "TOTAL"]],
        body: articulos.map((art) => [
          art.cantidad,
          art.codigo,
          art.descripcion,
          `$ ${Number(art.precio_unitario).toFixed(2)}`,
          `$ ${Number(art.total).toFixed(2)}`,
        ]),
        columnStyles: {
          0: { halign: 'center' },
          1: { halign: 'center' },
          2: { halign: 'center' },
          3: { halign: 'center' },
          4: { halign: 'center' },
        },
        headStyles: { fillColor: [54, 96, 146], textColor: 255, fontStyle: "bold", cellPadding: 2, halign: "center" },
      });

      // --------------------------
      // NOTAS (izq) + TOTAL GENERAL (der)
      // --------------------------
      const notasY = (doc as any).lastAutoTable.finalY + 10;

      // NOTAS O INSTRUCCIONES (IZQUIERDA)
      autoTable(doc, {
        startY: notasY,
        margin: { left: xLeft },
        tableWidth: colW,
        theme: "plain",
        head: [["NOTAS/INSTRUCCIONES"]],
        headStyles: { fillColor: [22, 54, 92], textColor: 255, fontStyle: "bold", halign: "center" },
        styles: { fontSize: 10, cellPadding: 3, lineWidth: 0.1, lineColor: [180, 180, 180] },
        columnStyles: {0: { cellPadding:10 },},
        body: [[""]], 
      });
      const notasEndY = (doc as any).lastAutoTable.finalY;

      // TOTAL GENERAL (DERECHA)
      autoTable(doc, {
        startY: notasY,
        margin: { left: xRight },
        tableWidth: colW,
        theme: "plain",
        styles: { fontSize: 12, cellPadding: 5 },
        body: [
          [
            { content: "Total", styles: { fontStyle: "bold", halign: "left" } },
            { content: `$ ${totalGeneral.toFixed(2)}`, styles: { fontStyle: "bold", halign: "right" } },
          ],
        ],
      });
      const totalEndY = (doc as any).lastAutoTable.finalY;

      const afterNotasTotalY = Math.max(notasEndY, totalEndY) + 10;

      // --------------------------
      // Texto: NO DEVOLUCIONES
      // --------------------------
      doc.setFontSize(9);
      doc.setFont("helvetica", "italic");
      doc.text( "ACEPTADO EL PEDIDO NO SE ACEPTAN DEVOLUCIONES.", pageWidth / 2, afterNotasTotalY,{ align: "center" });

      // --------------------------
      // Firma / Agente de venta
      // --------------------------
      autoTable(doc, {
        startY: afterNotasTotalY + 8,
        margin: { left: xLeft },
        tableWidth: pageWidth - margin * 2,
        theme: "plain",
        styles: { fontSize: 10, cellPadding: 4 },
        body: [
          [
            { content: "NOMBRE AGENTE DE VENTA", styles: { fontStyle: "bold", halign: "left" } },
            { content: pedido.Creado_por, styles: { halign: "center", fillColor: [220, 230, 241] } }, 
          ],
        ],
      });

      // --------------------------
      // Texto de agradecimiento
      // --------------------------
      autoTable(doc, {
        startY: (doc as any).lastAutoTable.finalY + 8,
        theme: "plain",
        styles: { fontSize: 10, cellPadding: 2, halign: "center", textColor: [0, 0, 0] },
        body: [
          ["¡Gracias por tu compra!"],
          ["¿Dudas o comentarios? Contáctanos a clientes@comercialcorrea.com.mx"],
        ],
      });

      // --------------------------
      // TÉRMINOS Y CONDICIONES
      // --------------------------
      autoTable(doc, {
        startY: (doc as any).lastAutoTable.finalY + 6,
        theme: "plain",
        head: [["TÉRMINOS Y CONDICIONES"]],
        headStyles: { fillColor: [22, 54, 92], textColor: 255, halign: "center" },
        styles: { fontSize: 8, cellPadding: 2 },
        body: [
          ["1. Vigencia de la cotización 15 días naturales. Sujeto a cambio de precio sin previo aviso."],
          ["2. Entrega centralizada al pie de obra. No incluye maniobras."],
          ["3. No incluye instalación, ni conexión."],
          ["4. No ofrecemos garantías, directamente con fabricante o marca."],
          ["5. No contamos con resguardo de producto."],
          ["6. La empresa no se hace responsable por cargos de maniobras."],
          ["7. Toda información proporcionada durante la cotización es confidencial. Acordadndo no divulgarla a terceros. (en caso de hacerlo pierde valides inmediata)"],
          ["8. Esta cotización anula y reemplaza cualquier otra cotización emitida previamente para este proyecto/venta. Las cotizaciones ta no son válidas"],
        ],
      });


      // --------------------------
      // DATOS BANCARIOS
      // --------------------------
      autoTable(doc, {
        startY: (doc as any).lastAutoTable.finalY + 4,
        theme: "plain",
        styles: { fontSize: 10, cellPadding: 2.5, lineWidth: 0.1, lineColor: [180, 180, 180], halign: "center" },
        body: [
          ["BANCOMER", "BANAMEX"],
          ["CTA: 0105097517", "CTA: 7086747"],
          ["SUC: 5847", "SUC: 7070"],
          ["CLAVE: 012802001050975176", "CLAVE: 002802700770867477"],
        ],
      });

       // --- PIE DE PÁGINA ---
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text( "Pomposo Díaz del Castillo 26, Nuevo Progreso, 86700 Macuspana, Tab.", pageWidth / 2, doc.internal.pageSize.getHeight() - 15,{ align: "center", });
      doc.text("TEL: 936 123 2716",pageWidth / 2,doc.internal.pageSize.getHeight() - 10,{ align: "center" });

      // Descargar
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
