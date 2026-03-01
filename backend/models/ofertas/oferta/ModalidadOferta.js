import mongoose from 'mongoose';
const schema = new mongoose.Schema({ nombre: String }, { timestamps: true, collection: 'modalidad_oferta' });
export default mongoose.model('ModalidadOferta', schema);