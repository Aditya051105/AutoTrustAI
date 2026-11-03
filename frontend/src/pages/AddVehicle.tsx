import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Upload, X } from 'lucide-react';

const AddVehicle = () => {
    const [formData, setFormData] = useState({
        brand: '',
        model: '',
        variant: '',
        manufacturing_year: 2021,
        registration_year: 2021,
        fuel_type: 'Petrol',
        transmission: 'Manual',
        mileage: 40000,
        color: 'White',
        number_of_owners: 1,
        location: '',
        asking_price: 1500000
    });

    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            setSelectedImages((prev) => [...prev, ...filesArray]);

            const newPreviews = filesArray.map((file) => URL.createObjectURL(file));
            setPreviewUrls((prev) => [...prev, ...newPreviews]);
        }
    };

    const removeImage = (index: number) => {
        setSelectedImages((prev) => prev.filter((_, i) => i !== index));
        setPreviewUrls((prev) => {
            URL.revokeObjectURL(prev[index]);
            return prev.filter((_, i) => i !== index);
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMsg('');

        try {
            const submitData = new FormData();
            
            // Append text fields
            Object.entries(formData).forEach(([key, value]) => {
                submitData.append(key, value.toString());
            });

            // Append uploaded gallery images
            selectedImages.forEach((imageFile) => {
                submitData.append('images', imageFile);
            });

            await api.post('/vehicles/add/', submitData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            navigate('/seller');
        } catch (err: any) {
            console.error("Failed to add vehicle", err);
            setErrorMsg(err.response?.data?.detail || "Failed to post listing. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">List a Used Vehicle</h1>
            <p className="text-slate-500 mb-8">Upload photos directly from your device gallery and set car specs for buyer verification.</p>
            
            {errorMsg && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                    {errorMsg}
                </div>
            )}

            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Brand / Make</label>
                            <input name="brand" type="text" placeholder="e.g. Toyota, Honda, Hyundai" required className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-primary focus:border-primary" onChange={handleChange} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Model</label>
                            <input name="model" type="text" placeholder="e.g. Camry, Civic, City" required className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-primary focus:border-primary" onChange={handleChange} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Variant / Trim</label>
                            <input name="variant" type="text" placeholder="e.g. XLE, VXi, ZX" required className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-primary focus:border-primary" onChange={handleChange} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Fuel Type</label>
                            <select name="fuel_type" className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-primary focus:border-primary" onChange={handleChange} value={formData.fuel_type}>
                                <option>Petrol</option>
                                <option>Diesel</option>
                                <option>Electric</option>
                                <option>Hybrid</option>
                                <option>CNG</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Transmission</label>
                            <select name="transmission" className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-primary focus:border-primary" onChange={handleChange} value={formData.transmission}>
                                <option>Manual</option>
                                <option>Automatic</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Manufacturing Year</label>
                            <input name="manufacturing_year" type="number" required className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-primary focus:border-primary" onChange={handleChange} value={formData.manufacturing_year} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Registration Year</label>
                            <input name="registration_year" type="number" required className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-primary focus:border-primary" onChange={handleChange} value={formData.registration_year} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Mileage (km driven)</label>
                            <input name="mileage" type="number" required className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-primary focus:border-primary" onChange={handleChange} value={formData.mileage} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Color</label>
                            <input name="color" type="text" required className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-primary focus:border-primary" onChange={handleChange} value={formData.color} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Number of Owners</label>
                            <input name="number_of_owners" type="number" required className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-primary focus:border-primary" onChange={handleChange} value={formData.number_of_owners} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Location (City)</label>
                            <input name="location" type="text" placeholder="e.g. San Francisco, CA or Mumbai" required className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-primary focus:border-primary" onChange={handleChange} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Asking Price (₹ / $)</label>
                            <input name="asking_price" type="number" required className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-primary focus:border-primary" onChange={handleChange} value={formData.asking_price} />
                        </div>

                        {/* Gallery Photo Upload Section */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Vehicle Gallery Photos
                            </label>
                            
                            <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 hover:border-primary transition text-center bg-slate-50 relative cursor-pointer">
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <div className="flex flex-col items-center">
                                    <div className="p-3 bg-blue-100 text-primary rounded-full mb-2">
                                        <Upload className="w-6 h-6" />
                                    </div>
                                    <span className="font-medium text-slate-700">Click or drag photos to upload from Gallery</span>
                                    <span className="text-xs text-slate-400 mt-1">PNG, JPG, WEBP up to 10MB per file</span>
                                </div>
                            </div>

                            {/* Gallery Preview Grid */}
                            {previewUrls.length > 0 && (
                                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {previewUrls.map((url, idx) => (
                                        <div key={idx} className="relative group rounded-lg overflow-hidden border border-slate-200 aspect-video bg-slate-100">
                                            <img src={url} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(idx)}
                                                className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-80 hover:opacity-100 transition"
                                                title="Remove photo"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                            {idx === 0 && (
                                                <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded font-medium">
                                                    Cover Photo
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end space-x-4 pt-4 border-t border-slate-100 mt-8">
                        <button 
                            type="button" 
                            onClick={() => navigate('/seller')} 
                            className="px-4 py-2 border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 transition"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="px-6 py-2 bg-primary text-white rounded-md hover:bg-blue-700 transition font-medium shadow-sm flex items-center gap-2 disabled:opacity-50"
                        >
                            {isSubmitting ? 'Uploading...' : 'Save & Publish Listing'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddVehicle;
