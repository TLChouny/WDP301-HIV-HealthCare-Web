import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Link, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import AnimatedElement from "../Home/AnimatedElement"
import { getAllBlogs } from "../../api/blogApi"
import type { Blog } from "../../types/blog"

const BlogSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [posts, setPosts] = useState<Blog[]>([])

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await getAllBlogs()
        setPosts(data)
      } catch (error) {
        console.error("Failed to fetch blogs:", error)
      }
    }

    fetchBlogs()
  }, [])

  useEffect(() => {
    if (!isAutoPlaying || posts.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % posts.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, posts.length])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 5000)
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + posts.length) % posts.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 5000)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % posts.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 5000)
  }

  if (posts.length === 0) return null

  return (
    <section className="py-16 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-72 h-72 bg-teal-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4">
        <AnimatedElement animationType="fade-up" duration={800} className="mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-800 relative inline-block mx-auto">
            <span className="relative z-10">Bài Viết Mới Nhất</span>
            <span className="absolute bottom-0 left-0 w-full h-2 bg-teal-100 -z-10 transform -rotate-1 rounded-full"></span>
          </h2>
          <p className="text-left text-gray-600 mt-4">
            Khám phá những thông tin y khoa mới nhất và hữu ích từ đội ngũ chuyên gia của chúng tôi
          </p>
        </AnimatedElement>

        <div className="relative max-w-6xl mx-auto">
          <button onClick={goToPrevious} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 hover:text-teal-600 w-12 h-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group">
            <ChevronLeft className="h-6 w-6 transition-transform group-hover:-translate-x-0.5" />
          </button>
          <button onClick={goToNext} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 hover:text-teal-600 w-12 h-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group">
            <ChevronRight className="h-6 w-6 transition-transform group-hover:translate-x-0.5" />
          </button>

          <div className="overflow-hidden rounded-2xl">
            <div className="flex transition-transform duration-700 ease-out h-[450px]" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
              {posts.map((article, index) => (
                <div key={index} className="w-full h-[450px] flex-shrink-0 px-4">
                  <div className="bg-white rounded-2xl h-[450px] shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden group max-w-4xl mx-auto">
                    <div className="md:flex">
                      <div className="md:w-3/5 h-[450px] relative overflow-hidden">
                        <img src={article.blogImage || "/placeholder.svg?height=300&width=400"} alt={article.blogTitle} className="w-full h-64 md:h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                      </div>
                      <div className="md:w-3/5 p-8 flex flex-col justify-center">
                        <h3 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800 leading-tight group-hover:text-teal-700 transition-colors duration-300">{article.blogTitle}</h3>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center text-white font-semibold">
                              {article.blogAuthor?.split(" ").pop()?.charAt(0) || "?"}
                            </div>
                            <span className="text-gray-700 font-medium">Tác giả: {article.blogAuthor}</span>
                          </div>
                          <Link to={`/blog/${article._id}`} className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-medium px-6 py-3 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                            <span>Đọc tiếp</span>
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center mt-8 gap-2">
            {posts.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex ? "bg-teal-600 w-8" : "bg-gray-300 hover:bg-gray-400"}`}
              />
            ))}
          </div>

          <div className="mt-4 max-w-xs mx-auto">
            <div className="w-full bg-gray-200 rounded-full h-1">
              <div
                className="bg-gradient-to-r from-teal-500 to-teal-600 h-1 rounded-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / posts.length) * 100}%` }}
              ></div>
            </div>
            <p className="text-center text-sm text-gray-500 mt-2">
              {currentIndex + 1} / {posts.length}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default BlogSection
