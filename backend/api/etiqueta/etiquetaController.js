const PDFDocument = require("pdfkit");
const fs = require("fs");
const { resolve } = require("path");
const { createCanvas } = require("canvas");
const http = require("http");

const JsBarcode = require("jsbarcode");

const paper = {
  paperSize: [80, 279.4],
  paperMargins: {
    top: 2,
    bottom: 2,
    left: 2,
    right: 2
  }
};
const produtos = [
  {
    codigo: "1.0001",
    descricao: "Descrição do produto X",
    marca: "Marca do produto",
    cor: "Amarelo",
    tamanho: "G",
    valor: "10,00"
  },
  {
    codigo: "1.0002",
    descricao: "Descrição do produto X",
    marca: "Marca do produto",
    cor: "Laranja",
    tamanho: "G",
    valor: "150,00"
  },
  {
    codigo: "1.0003",
    descricao: "Descrição do produto X",
    marca: "Marca do produto",
    cor: "Preto",
    tamanho: "XXG2",
    valor: "65,99"
  }
];
function _generateBarCode(text) {
  let canvas = createCanvas();
  JsBarcode(canvas, text, { format: "CODE39" });
  return canvas.toDataURL("image/png");
}

function _generateEtiqueta(documentPdf, produto, nEtiqueta) {
  altura = Number(nEtiqueta) * 80 + 5;
  documentPdf.fontSize(10).text(`${produto.descricao}`, 5, altura);
  documentPdf.image(_generateBarCode(`${produto.codigo}`), 130, altura - 5, {
    width: 120
  });
  documentPdf.text(`M: ${produto.marca}`);
  documentPdf.text(`C:${produto.cor} - T: ${produto.tamanho}`);
  documentPdf.fontSize(25).text(`R$ ${produto.valor}`);
}

class etiquetaController {
  async store(req, res) {
    try {
      const caminho = resolve(__dirname, "..", "..", "tmp", "pdfs");
      const pdf = new PDFDocument({
        size: paper.Size,
        margins: paper.paperMargins
      });

      produtos.forEach((produto, index) => {
        _generateEtiqueta(pdf, produto, index);
      });

      const writeStream = await fs.createWriteStream(
        `${caminho}/etiquetas.pdf`
      );
      pdf.pipe(writeStream);
      pdf.end();
      writeStream.on("finish", function() {
        res.setHeader("Access-Control-Allow-Origin", "*");
        return res.download(`${caminho}/etiquetas.pdf`);
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error });
    }
  }
}

module.exports = new etiquetaController();
