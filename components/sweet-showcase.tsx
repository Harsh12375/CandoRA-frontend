"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ShoppingCart, ChevronUp, ChevronDown, X, Plus, Minus, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { useRouter } from "next/navigation"

const sweetsData = [
  {
    id: 1,
    name: "Gulab Jamun",
    category: "Traditional",
    price: 12.5,
    stock: 25,
    imageUrl: "https://i.postimg.cc/NM0c9B47/Gemini-Generated-Image-gyndi2gyndi2gynd-removebg-preview-1.png",
    bgColor: "#f7e1d3",
  },
  {
    id: 2,
    name: "Rasgulla",
    category: "Bengali",
    price: 10.0,
    stock: 0,
    imageUrl: "https://i.postimg.cc/MGLSQgrC/Gemini-Generated-Image-jeutk2jeutk2jeut-removebg-preview.png",
    bgColor: "#f5faff",
  },
  {
    id: 3,
    name: "Kaju Katli",
    category: "Premium",
    price: 25.0,
    stock: 15,
    imageUrl: "https://i.postimg.cc/JhvfnZsm/Gemini-Generated-Image-2kd6ga2kd6ga2kd6-removebg-preview.png",
    bgColor: "#f7f3e8",
  },
  {
    id: 4,
    name: "Barfi",
    category: "Traditional",
    price: 18.0,
    stock: 30,
    imageUrl: "https://i.postimg.cc/BbMN8fmD/Gemini-Generated-Image-jve0tejve0tejve0-removebg-preview.png",
    bgColor: "#fdf5f7",
  },
  {
    id: 5,
    name: "Ladoo",
    category: "Festival",
    price: 15.0,
    stock: 20,
    imageUrl: "https://i.postimg.cc/nL1xhTym/Gemini-Generated-Image-ngz7f5ngz7f5ngz7-removebg-preview.png",
    bgColor: "#fff0b3",
  },
  {
    id: 6,
    name: "Jalebi",
    category: "Crispy",
    price: 8.0,
    stock: 40,
    imageUrl: "https://i.postimg.cc/s2WcYNjB/Gemini-Generated-Image-fkayw1fkayw1fkay-removebg-preview.png",
    bgColor: "#ffecd5",
  },
  {
    id: 7,
    name: "Soan Papdi",
    category: "Flaky",
    price: 12.0,
    stock: 12,
    imageUrl: "https://i.postimg.cc/htsJH82C/Gemini-Generated-Image-43y81l43y81l43y8-removebg-preview.png",
    bgColor: "#fff6e5",
  },
  {
    id: 8,
    name: "Peda",
    category: "Milk",
    price: 14.0,
    stock: 18,
    imageUrl: "https://i.postimg.cc/13znZ43T/Gemini-Generated-Image-noymnbnoymnbnoym-removebg-preview.png",
    bgColor: "#fce5d0",
  },
  {
    id: 9,
    name: "Chocolate Truffle",
    category: "Western",
    price: 30.0,
    stock: 8,
    imageUrl: "https://i.postimg.cc/LXF8hsmm/Gemini-Generated-Image-y3hx76y3hx76y3hx-removebg-preview.png",
    bgColor: "#e5d4cf",
  },
  {
    id: 10,
    name: "Cheesecake Slice",
    category: "Western",
    price: 28.0,
    stock: 5,
    imageUrl: "https://i.postimg.cc/t4Hg4Yz7/Gemini-Generated-Image-4c47th4c47th4c47-removebg-preview.png",
    bgColor: "#f6f0eb",
  },
]

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  imageUrl: string
}

export default function SweetShowcase() {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [priceRange, setPriceRange] = useState([0, 50])
  const [showFilters, setShowFilters] = useState(false)
  const [filteredSweets, setFilteredSweets] = useState(sweetsData)

  const lastScrollTime = useRef(0)
  const scrollThrottle = 800 // milliseconds

  const currentSweet = filteredSweets.length > 0 ? filteredSweets[currentIndex] || filteredSweets[0] : null

  useEffect(() => {
    const filtered = sweetsData.filter((sweet) => {
      const matchesSearch =
        sweet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sweet.category.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === "all" || sweet.category === selectedCategory
      const matchesPrice = sweet.price >= priceRange[0] && sweet.price <= priceRange[1]

      return matchesSearch && matchesCategory && matchesPrice
    })

    setFilteredSweets(filtered)
    if (filtered.length > 0) {
      setCurrentIndex(0)
    }
  }, [searchQuery, selectedCategory, priceRange])

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()

      const now = Date.now()
      if (now - lastScrollTime.current < scrollThrottle) {
        return // Throttle scroll events
      }
      lastScrollTime.current = now

      if (e.deltaY > 0 && currentIndex < filteredSweets.length - 1) {
        setCurrentIndex((prev) => prev + 1)
      } else if (e.deltaY < 0 && currentIndex > 0) {
        setCurrentIndex((prev) => prev - 1)
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" && currentIndex < filteredSweets.length - 1) {
        setCurrentIndex((prev) => prev + 1)
      } else if (e.key === "ArrowUp" && currentIndex > 0) {
        setCurrentIndex((prev) => prev - 1)
      }
    }

    window.addEventListener("wheel", handleWheel, { passive: false })
    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("wheel", handleWheel)
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [currentIndex, filteredSweets.length])

  const addToCart = (sweet: (typeof sweetsData)[0]) => {
    if (sweet.stock === 0) return

    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === sweet.id)
      if (existingItem) {
        return prev.map((item) => (item.id === sweet.id ? { ...item, quantity: item.quantity + 1 } : item))
      } else {
        return [
          ...prev,
          {
            id: sweet.id,
            name: sweet.name,
            price: sweet.price,
            quantity: 1,
            imageUrl: sweet.imageUrl,
          },
        ]
      }
    })
  }

  const updateCartQuantity = (id: number, newQuantity: number) => {
    if (newQuantity === 0) {
      setCartItems((prev) => prev.filter((item) => item.id !== id))
    } else {
      setCartItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)))
    }
  }

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  const navigateToSection = (index: number) => {
    setCurrentIndex(index)
  }

  const nextSection = () => {
    if (currentIndex < filteredSweets.length - 1) {
      setCurrentIndex((prev) => prev + 1)
    }
  }

  const prevSection = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1)
    }
  }

  const handleLogout = () => {
    try {
      localStorage.removeItem("userToken")
    } catch (e) {
      // ignore storage errors
    }
    router.push("/auth")
  }

  const categories = ["all", ...Array.from(new Set(sweetsData.map((sweet) => sweet.category)))]

  return (
    <motion.div
      className="h-screen w-full overflow-hidden relative"
      animate={{ backgroundColor: currentSweet?.bgColor || "#f7e1d3" }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      {/* Decorative background blobs */}
      <motion.div
        className="pointer-events-none absolute -top-24 -left-24 w-72 h-72 rounded-full bg-gradient-to-br from-rose-200/40 to-pink-200/40 blur-3xl"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute -bottom-32 -right-24 w-96 h-96 rounded-full bg-gradient-to-tr from-amber-200/40 to-orange-200/40 blur-3xl"
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Sticky Header */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 px-6 py-4 backdrop-blur-sm bg-white/10"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="grid grid-cols-3 items-center max-w-7xl mx-auto bg-white/30 backdrop-blur-md rounded-full px-4 py-2 shadow-lg border border-white/50">
          <motion.div className="flex items-center space-x-2" whileHover={{ scale: 1.05 }}>
            <div className="w-8 h-8 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full"></div>
            <span className="font-display text-xl font-bold text-gray-800">CandoRA</span>
          </motion.div>
          <div className="hidden md:flex items-center justify-center space-x-3 justify-self-center">
            <Input
              placeholder="Search sweets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-72 md:w-96 h-11 md:h-12 rounded-full px-4 bg-white/60 border-white/40 text-base"
            />
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-40 h-11 md:h-12 rounded-full bg-white/60 border-white/40 text-base">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === "all" ? "All" : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="w-40">
              <Slider value={priceRange} onValueChange={setPriceRange} max={50} min={0} step={1} className="w-full" />
              <div className="text-xs text-gray-600 mt-1 text-center">
                Rs {priceRange[0]} - Rs {priceRange[1]}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end">
            <motion.button
              onClick={handleLogout}
              className="mr-3 flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-gray-800 hover:bg-white/30 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline">Logout</span>
            </motion.button>
            <motion.button
              onClick={() => setIsCartOpen(true)}
              className="relative p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ShoppingCart className="w-6 h-6 text-gray-800" />
              {getTotalItems() > 0 && (
                <motion.span
                  className="absolute -top-2 -right-2 bg-rose-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-semibold"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  {getTotalItems()}
                </motion.span>
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile filters */}
        <div className="md:hidden mt-4 space-y-3">
          <Input
            placeholder="Search sweets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white/50 border-white/30"
          />
          <div className="flex space-x-3">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="flex-1 bg-white/50 border-white/30">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex-1">
              <Slider value={priceRange} onValueChange={setPriceRange} max={50} min={0} step={1} className="w-full" />
              <div className="text-xs text-gray-600 mt-1 text-center">
                Rs {priceRange[0]} - Rs {priceRange[1]}
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="h-full flex items-center justify-center px-6">
        {!currentSweet ? (
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-gray-800">No sweets found</h2>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
            <Button
              onClick={() => {
                setSearchQuery("")
                setSelectedCategory("all")
                setPriceRange([0, 50])
              }}
              className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white"
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Sweet Details */}
            <motion.div
              className="space-y-8 text-center lg:text-left"
              key={`details-${currentIndex}`}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="space-y-4">
                <motion.p
                  className="inline-block text-xs uppercase tracking-wider font-medium text-gray-700 bg-white/70 rounded-full px-3 py-1 shadow-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  {currentSweet.category}
                </motion.p>

                <motion.h1
                  className="font-display text-4xl md:text-6xl font-bold text-gray-800 leading-tight"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  {currentSweet.name}
                </motion.h1>

                <motion.p
                  className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent drop-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  Rs {currentSweet.price.toFixed(2)}
                </motion.p>

                <motion.p
                  className={`text-lg font-medium ${currentSweet.stock > 0 ? "text-green-600" : "text-red-500"}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.55 }}
                >
                  {currentSweet.stock > 0 ? `${currentSweet.stock} in stock` : "Out of stock"}
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <Button
                  onClick={() => addToCart(currentSweet)}
                  disabled={currentSweet.stock === 0}
                  className={`px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 ring-1 ${
                    currentSweet.stock === 0
                      ? "bg-gray-400 cursor-not-allowed ring-gray-300/30"
                      : "bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white ring-rose-300/40 hover:shadow-rose-300/50"
                  }`}
                >
                  {currentSweet.stock === 0 ? "Out of Stock" : "Add to Cart"}
                </Button>
              </motion.div>
            </motion.div>

            {/* Right Side - Sweet Image */}
            <motion.div
              className="relative flex justify-center lg:justify-end"
              key={`image-${currentIndex}`}
              initial={{ opacity: 0, x: 50, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="absolute -z-10 w-72 h-72 md:w-[30rem] md:h-[30rem] rounded-full bg-gradient-to-br from-rose-200/60 via-pink-100/60 to-amber-100/60 blur-3xl translate-y-6" />
              <motion.img
                src={currentSweet.imageUrl}
                alt={currentSweet.name}
                className="w-96 h-96 md:w-[28rem] md:h-[28rem] object-contain drop-shadow-2xl"
                whileHover={{ scale: 1.05, rotate: 2 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            </motion.div>
          </div>
        )}
      </div>

      {/* Section Indicators */}
      {filteredSweets.length > 0 && (
        <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-40 space-y-3">
          {filteredSweets.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => navigateToSection(index)}
              className={`w-3 h-3 rounded-full ring-2 transition-all duration-300 ${
                index === currentIndex
                  ? "bg-rose-500 ring-rose-300 shadow-lg scale-125"
                  : "bg-white/70 hover:bg-white/90 ring-white/80"
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>
      )}

      {filteredSweets.length > 0 && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-40 flex space-x-4">
          <motion.button
            onClick={prevSection}
            disabled={currentIndex === 0}
            className={`p-4 rounded-full backdrop-blur-md shadow-lg transition-all duration-300 ${
              currentIndex === 0
                ? "bg-white/30 text-gray-400 cursor-not-allowed"
                : "bg-white/60 text-gray-700 hover:bg-white/80"
            }`}
            whileHover={currentIndex > 0 ? { scale: 1.1 } : {}}
            whileTap={currentIndex > 0 ? { scale: 0.95 } : {}}
          >
            <ChevronUp className="w-6 h-6" />
          </motion.button>

          <motion.button
            onClick={nextSection}
            disabled={currentIndex === filteredSweets.length - 1}
            className={`p-4 rounded-full backdrop-blur-md shadow-lg transition-all duration-300 ${
              currentIndex === filteredSweets.length - 1
                ? "bg-white/30 text-gray-400 cursor-not-allowed"
                : "bg-white/60 text-gray-700 hover:bg-white/80"
            }`}
            whileHover={currentIndex < filteredSweets.length - 1 ? { scale: 1.1 } : {}}
            whileTap={currentIndex < filteredSweets.length - 1 ? { scale: 0.95 } : {}}
          >
            <ChevronDown className="w-6 h-6" />
          </motion.button>
        </div>
      )}

      {/* Section Counter */}
      {filteredSweets.length > 0 && (
        <motion.div
          className="fixed bottom-6 left-6 z-40 text-gray-700 font-medium bg-white/50 backdrop-blur-md rounded-full px-4 py-2 shadow-lg border border-white/60"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <span className="text-2xl font-bold">{String(currentIndex + 1).padStart(2, "0")}</span>
          <span className="text-lg mx-2">/</span>
          <span className="text-lg">{String(filteredSweets.length).padStart(2, "0")}</span>
        </motion.div>
      )}

      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
            />
            <motion.div
              className="fixed right-0 top-0 h-full w-96 bg-white z-50 shadow-2xl"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              <div className="p-6 h-full flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Your Cart</h2>
                  <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-4">
                  {cartItems.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">Your cart is empty</p>
                  ) : (
                    cartItems.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                        <img
                          src={item.imageUrl || "/placeholder.svg"}
                          alt={item.name}
                          className="w-16 h-16 object-contain rounded"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800">{item.name}</h3>
                          <p className="text-rose-600 font-medium">Rs {item.price.toFixed(2)}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:bg-gray-200 rounded"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-gray-200 rounded"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {cartItems.length > 0 && (
                  <div className="border-t pt-4 space-y-4">
                    <div className="flex justify-between items-center text-xl font-bold">
                      <span>Total:</span>
                      <span className="text-rose-600">Rs {getTotalPrice().toFixed(2)}</span>
                    </div>
                    <Button className="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white py-3 text-lg font-semibold">
                      Purchase Now
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
