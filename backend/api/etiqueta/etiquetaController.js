const Produto = require("../produto/produto");
const PDFDocument = require("pdfkit");
const stream = require("../../libs/stream");
const { resolve } = require("path");
const fs = require("fs");
//const { createCanvas } = require("canvas");
//const JsBarcode = require("jsbarcode");

const paper = {
  paperSize: [80, 279.4],
  paperMargins: {
    top: 2,
    bottom: 2,
    left: 2,
    right: 2
  }
};

/*function _generateBarCode(text) {
  let canvas = createCanvas();
  JsBarcode(canvas, text, { format: "CODE39" });
  return canvas.toDataURL("image/png");
}*/

function _generateEtiqueta(documentPdf, produto, nEtiqueta) {
  altura = Number(nEtiqueta) * 90 + 5;
  documentPdf.fontSize(10).text(`código: ${produto.codigo}`, 5, altura);
  documentPdf.fontSize(10).text(`${produto.titulo} - ${produto.descricao}`);
  /*documentPdf.image(_generateBarCode(`${produto.codigo}`), 130, altura - 5, {
    width: 120
  });*/
  documentPdf.text(`marca: ${produto.marca}`);
  documentPdf.text(`cor: ${produto.cor}`);
  documentPdf.text(`tamanho: ${produto.tamanho}`);
  let val = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(produto.valor);
  documentPdf.fontSize(25).text(`${val}`);
}

class etiquetaController {
  async store(req, res) {
    try {
      //Consultar produtos
      const listEtiquetas = req.body.produto.map(etiqueta => {
        return { _id: etiqueta };
      });

      const caminho = resolve(__dirname, "..", "..", "tmp", "pdfs");
      const pdf = new PDFDocument({
        size: paper.Size,
        margins: paper.paperMargins,
        autoFirstPage: false
      });

      const produtos = await Produto.find({ $or: listEtiquetas });
      produtos.forEach((produto, index) => {
        if (index % 8 == 0) {
          pdf.addPage({
            size: paper.Size,
            margins: paper.paperMargins
          });
        }
        console.log(index);
        _generateEtiqueta(pdf, produto, index);
      });

      const writeStream = await fs.createWriteStream(
        `${caminho}/etiquetas.pdf`
      );
      pdf.pipe(writeStream);
      pdf.pipe(res);
      pdf.end();
      /*await writeStream.on("finish", function() {
        let arquivoPdf = `${caminho}/etiquetas.pdf`;
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Content-type", "application/pdf");
        return res.download(arquivoPdf);
        
      });*/
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error });
    }
  }
}

module.exports = new etiquetaController();
