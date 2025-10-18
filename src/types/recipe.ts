export type Platform = 'youtube' | 'instagram' | 'facebook' | 'tiktok' | 'own' | 'other'

export interface Comment {
  id: string
  text: string
  createdAt: string
}

export interface Ingredient {
  name: string
  quantity?: string
}

export interface Recipe {
  id: string
  title: string
  url: string
  platform: Platform
  description: string
  imageUrl?: string // YouTube thumbnail or manual URL
  uploadedImageUrl?: string // Firebase Storage uploaded image
  notes?: string
  ingredients: Ingredient[]
  rating?: number // 1-5 stars
  comments: Comment[]
  createdAt: string
}

