import mongoose from 'mongoose';
const schema = new mongoose.Schema({ nombre: String }, { timestamps: true, collection: 'tipo_oferta' });
export default mongoose.model('TipoOferta', schema);