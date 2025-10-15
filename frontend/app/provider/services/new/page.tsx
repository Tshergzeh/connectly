'use client';

import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { createService } from "~/lib/api/services";

export default function NewServicePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [form, setForm] = useState({
        title: '',
        description: '',
        price: '',
        category: '',
        image: null as File | null,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            setForm(prev => ({ ...prev, image: file }));
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.title || !form.description || !form.price || !form.category || !form.image) {
            toast.error('Please fill in all required fields');
            return;
        }

        const formData = new FormData();
        formData.append('title', form.title);
        formData.append('description', form.description);
        formData.append('price', form.price);
        formData.append('category', form.category);
        formData.append('image', form.image);

        try {
            setLoading(true);
            const res = await createService(formData);
            toast.success('Service created successfully!');
            router.push('/provider/bookings');
        } catch (error: any) {
            toast.error(error.message || 'Failed to create service');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-10 px-4">
            <h1 className="text-2xl font-semibold mb-8">Create New Service</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Title</label>
                    <input
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-2 focus:outline-none focus:ring focus:ring-indigo-500"
                        placeholder="Enter service title"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Describe your service"
                        className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-2 focus:outline-none focus:ring focus:ring-indigo-500"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Price (&#8358;)</label>
                        <input
                            type="number"
                            name="price"
                            value={form.price}
                            onChange={handleChange}
                            placeholder="e.g. 15000"
                            className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-2 focus:outline-none focus:ring focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Category</label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-2 focus:outline-none focus:ring focus:ring-indigo-500"
                            name="category"
                            value={form.category}
                            onChange={handleChange}
                            placeholder="e.g. Home Cleaning"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Image</label>
                    <input type="file" accept="image/*" onChange={handleImageChange} />
                    {preview && (
                        <img
                            src={preview}
                            alt="Preview"
                            className="mt-3 h-48 w-full object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                        />
                    )}
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition disabled:opacity-70"
                >
                    {loading ? 'Creating...' : 'Create Service'}
                </button>
            </form>
        </div>
    );
}