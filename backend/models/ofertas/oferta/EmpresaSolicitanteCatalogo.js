import mongoose from 'mongoose';
const schema = new mongoose.Schema(
  { nombre: String, categoria: { type: mongoose.Schema.Types.ObjectId, ref: 'ModalidadOferta' } },
  { timestamps: true, collection: 'empresasolicitantes' }
);
export default mongoose.model('EmpresaSolicitanteCatalogo', schema);