import mongoose from 'mongoose';

const SectorSchema = new mongoose.Schema({
  codigo: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  nombre: {
    type: String,
    required: true,
    trim: true,
    uppercase: true
  }
}, {
  timestamps: true,
  collection: 'sectores'
});

export default mongoose.model('Sector', SectorSchema);