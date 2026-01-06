import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();
const PORT = 4000;

app.use(cors({ origin: '*' })); // Allow requests from any frontend (Vercel)
app.use(express.json());

// --- 1. Auto-Seed Function (SQLite Compatible) ---
async function ensureDataExists() {
  try {
    const count = await prisma.product.count();
    if (count === 0) {
      console.log("Database empty. Seeding data...");
      
      const products = [
        {
          name: "Running Shoes",
          price: 89.99,
          category: "Apparel",
          image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
          isInStock: true,
          variants: JSON.stringify(["8", "9", "10"])
        },
        {
          name: "Gaming Headset",
          price: 199.99,
          category: "Electronics",
          image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
          isInStock: false,
          variants: JSON.stringify(["Black", "White"])
        },
        {
          name: "Cotton Hoodie",
          price: 45.00,
          category: "Apparel",
          image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500",
          isInStock: true,
          variants: JSON.stringify(["S", "M", "L", "XL"])
        }
      ];

      // Use loop for SQLite compatibility
      for (const p of products) {
        await prisma.product.create({ data: p });
      }
      
      console.log("Seeding complete!");
    } else {
      console.log("Data already exists.");
    }
  } catch (error) {
    console.error("Seeding failed:", error);
  }
}

// --- 2. API Endpoints ---

// GET /products (Supports ?category=Apparel)
app.get('/api/products', async (req, res) => {
  const { category } = req.query;
  try {
    const products = await prisma.product.findMany({
      where: category ? { category: String(category) } : undefined,
    });
    
    // Parse variants JSON string back to array
    const formatted = products.map((p: any) => ({
      ...p,
      variants: JSON.parse(p.variants)
    }));
    
    res.json(formatted);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// GET /products/:id
app.get('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const product = await prisma.product.findUnique({ where: { id: Number(id) } });
    if (!product) return res.status(404).json({ error: "Product not found" });
    
    // @ts-ignore
    res.json({ ...product, variants: JSON.parse(product.variants) });
  } catch (error) {
    res.status(500).json({ error: "Error fetching product" });
  }
});

// POST /products (Bonus Task)
app.post('/api/products', async (req, res) => {
  const { name, price, category, image, isInStock, variants } = req.body;

  if (!name || !price || !category) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const newProduct = await prisma.product.create({
      data: {
        name,
        price: parseFloat(price),
        category,
        image: image || "https://via.placeholder.com/300",
        isInStock: isInStock ?? true,
        variants: JSON.stringify(variants || [])
      }
    });
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: "Creation failed" });
  }
});

// Manual Seed Endpoint (Backup)
app.get('/api/seed', async (req, res) => {
  await ensureDataExists();
  res.json({ message: "Seed check complete" });
});

// --- 3. Start Server ---
app.listen(PORT, async () => {
  await ensureDataExists(); // Auto-seed on startup
  console.log(`Server running on http://localhost:${PORT}`);
});
