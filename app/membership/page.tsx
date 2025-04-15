'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function CafeMembershipForm() {
    const router = useRouter();
    const [isLogin, setIsLogin] = useState(true);
    const [imageLinks, setImageLinks] = useState(['']);
    const [formData, setFormData] = useState({
        club_name: '',
        location: {
            address: '',
            city: '',
            state: '',
            country: ''
        },
        capacity: '',
        mailId: '',
        password: '',
        email_id: '',
        loginPassword: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
      const checkCafeLogin  =  localStorage.getItem("cafeToken")
      if(checkCafeLogin){
        router.push('/cafe/dashboard');
      }
    },[])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name in formData.location) {
            setFormData(prev => ({
                ...prev,
                location: {
                    ...prev.location,
                    [name]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleImageChange = (index: number, value: string) => {
        const newLinks = [...imageLinks];
        newLinks[index] = value;
        setImageLinks(newLinks);
    };

    const addImageLink = () => {
        setImageLinks(prev => [...prev, '']);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true); 

        const payload: any = {
            action: isLogin ? 'login' : 'signup'
        };

        if (isLogin) {
            payload.email_id = formData.email_id;
            payload.password = formData.loginPassword;
        } else {
            payload.club_name = formData.club_name;
            payload.location = formData.location; 
            payload.capacity = formData.capacity;
            payload.email_id = formData.mailId;
            payload.password = formData.password;
            payload.images_url = imageLinks.filter(link => link.trim() !== '');
        }

        try {
            const response = await fetch(`/api/cafe-${isLogin ? 'login' : 'registration'}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            if (result.success) {
                alert(result.message);
                if (isLogin) {
                    localStorage.setItem("cafeToken", result.token)
                    router.push('/cafe/dashboard');
                } else {
                    setIsLogin(true);
                }
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        } finally {
            setIsLoading(false); 
        }
    };

    return (
        <div className="relative h-screen w-full flex items-center justify-center bg-gray-900 overflow-hidden px-4">
             <div className="absolute inset-0 overflow-hidden  z-0">
              {[...Array(30)].map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full bg-pink-400/20"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    width: `${Math.random() * 10 + 5}px`,
                    height: `${Math.random() * 10 + 5}px`,
                    animation: `float ${Math.random() * 10 + 10}s linear infinite`,
                    opacity: Math.random() * 0.4 + 0.1
                  }}
                />
              ))}
            </div>
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-h-[80vh] z-10 w-screen max-w-lg p-6 bg-gray-800 rounded-xl shadow-2xl overflow-y-auto scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-gray-700"
            >
                <h2 className="text-xl text-center sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300">
                    {isLogin ? 'Cafe Login' : 'Cafe Signup'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                    {isLogin ? (
                        <>
                            <div>
                                <label className="block text-gray-300 mb-1 text-sm">Email</label>
                                <input
                                    type="email"
                                    name="email_id"
                                    value={formData.email_id}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-300 mb-1 text-sm">Password</label>
                                <input
                                    type="password"
                                    name="loginPassword"
                                    value={formData.loginPassword}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    required
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            <div>
                                <label className="block text-gray-300 mb-1 text-sm">Club Name</label>
                                <input
                                    type="text"
                                    name="club_name"
                                    value={formData.club_name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-300 mb-1 text-sm">City</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.location.city}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white text-sm"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-300 mb-1 text-sm">State</label>
                                    <input
                                        type="text"
                                        name="state"
                                        value={formData.location.state}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white text-sm"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-300 mb-1 text-sm">Address</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.location.address}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white text-sm"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-gray-300 mb-1 text-sm">Country</label>
                                <input
                                    type="text"
                                    name="country"
                                    value={formData.location.country}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white text-sm"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-gray-300 mb-1 text-sm">Capacity</label>
                                <input
                                    type="number"
                                    name="capacity"
                                    value={formData.capacity}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white text-sm"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-gray-300 mb-1 text-sm">Email</label>
                                <input
                                    type="email"
                                    name="mailId"
                                    value={formData.mailId}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white text-sm"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-gray-300 mb-1 text-sm">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white text-sm"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-gray-300 mb-1 text-sm">Image URLs</label>
                                {imageLinks.map((link, index) => (
                                    <div key={index} className="mb-2 flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={link}
                                            onChange={(e) => handleImageChange(index, e.target.value)}
                                            placeholder="https://example.com/image.jpg"
                                            className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white text-sm"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const updatedLinks = imageLinks.filter((_, i) => i !== index);
                                                setImageLinks(updatedLinks);
                                            }}
                                            className="text-red-400 hover:text-red-600 text-sm"
                                            title="Delete"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}

                                <button
                                    type="button"
                                    onClick={addImageLink}
                                    className="mt-2 px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white text-sm rounded-md"
                                >
                                    Add More Links
                                </button>
                            </div>
                        </>
                    )}

                    <button
                        type="submit"
                        className={`w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-2xl font-bold text-white text-lg transition-all ${
                            isLoading ? 'opacity-80' : 'hover:scale-105 cursor-pointer'
                        }`}
                        disabled={isLoading} // Disable button while loading
                    >
                        {isLoading ? 'Loading...' : isLogin ? 'Login' : 'Sign Up'}
                    </button>
                </form>

                <p className="mt-4 text-center text-gray-300 text-sm ">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button
                        type="button"
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-purple-400 hover:text-purple-300 underline cursor-pointer"
                    >
                        {isLogin ? 'Sign up here' : 'Login here'}
                    </button>
                </p>
            </motion.div>
        </div>
    );
}
