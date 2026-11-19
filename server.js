const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8000;
const PUBLIC_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

// In-Memory Database store with initial bootstrap for backend API requests
let dbUsers = [
  { id: "usr_101", name: "Alex Morgan", email: "alex.morgan@driveease.com", phone: "+91 98765 43210", city: "Bangalore", status: "Active", joined: "2025-11-10", totalBookings: 3 },
  { id: "usr_102", name: "Priya Sundaram", email: "priya.s@gmail.com", phone: "+91 94432 10987", city: "Chennai", status: "Active", joined: "2026-01-15", totalBookings: 2 },
  { id: "usr_103", name: "Vikram Malhotra", email: "vikram.m@techventures.in", phone: "+91 98840 55219", city: "Mumbai", status: "Active", joined: "2026-02-04", totalBookings: 4 },
  { id: "usr_104", name: "Ananya Sharma", email: "ananya.sharma@design.co", phone: "+91 97910 88321", city: "Chennai", status: "Active", joined: "2026-03-12", totalBookings: 1 },
  { id: "usr_105", name: "Karthik Rajan", email: "karthik.rajan@photos.in", phone: "+91 98401 77652", city: "Coimbatore", status: "Active", joined: "2026-04-20", totalBookings: 2 },
  { id: "usr_106", name: "Rohan Verma", email: "rohan.verma@corp.com", phone: "+91 98112 33445", city: "Hyderabad", status: "Blocked", joined: "2026-05-08", totalBookings: 0 }
];

let dbReviews = [
  { id: "rev_1", customerName: "Ananya Sharma", carName: "Hyundai Creta SX(O)", rating: 5, date: "2026-11-10", comment: "Spotless car, timely airport handover, and very smooth drive.", status: "Approved" },
  { id: "rev_2", customerName: "Vikram Malhotra", carName: "BMW 3 Series Gran Limousine", rating: 5, date: "2026-11-12", comment: "Effortless executive rental in Bangalore. Pristine vehicle condition.", status: "Approved" },
  { id: "rev_3", customerName: "Karthik Rajan", carName: "Mahindra Thar LX 4x4", rating: 5, date: "2026-11-14", comment: "Took the Thar up the Western Ghats. Rugged beast performed flawlessly.", status: "Approved" },
  { id: "rev_4", customerName: "Priya Sundaram", carName: "Honda City 5th Gen ZX", rating: 4, date: "2026-11-16", comment: "Great comfortable sedan for family road trip to Salem.", status: "Approved" }
];

const server = http.createServer((req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;

  // --- REST API ROUTES (/api/...) ---
  if (pathname.startsWith('/api/')) {
    res.setHeader('Content-Type', 'application/json');

    // Admin Auth Endpoint
    if (pathname === '/api/admin/login' && req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        try {
          const data = JSON.parse(body || '{}');
          if (data.email === 'admin@driveease.com' && data.password === 'admin123') {
            res.writeHead(200);
            res.end(JSON.stringify({
              success: true,
              token: 'admin_jwt_secret_token_driveease_2026',
              user: {
                name: 'Chief Fleet Admin',
                email: 'admin@driveease.com',
                role: 'Super Admin',
                avatar: 'AD'
              }
            }));
          } else {
            res.writeHead(401);
            res.end(JSON.stringify({ success: false, message: 'Invalid admin credentials. Use admin@driveease.com / admin123' }));
          }
        } catch (e) {
          res.writeHead(400);
          res.end(JSON.stringify({ success: false, message: 'Invalid JSON request' }));
        }
      });
      return;
    }

    // Admin Overview Stats Endpoint
    if (pathname === '/api/admin/stats' && req.method === 'GET') {
      res.writeHead(200);
      res.end(JSON.stringify({
        totalUsers: dbUsers.length,
        totalCars: 14,
        totalBookings: 28,
        activeBookings: 8,
        completedBookings: 18,
        cancelledBookings: 2,
        totalRevenue: 284500,
        monthlyGrowth: "+14.8%"
      }));
      return;
    }

    // Users CRUD Endpoints
    if (pathname === '/api/admin/users' && req.method === 'GET') {
      res.writeHead(200);
      res.end(JSON.stringify({ success: true, users: dbUsers }));
      return;
    }

    if (pathname === '/api/admin/reviews' && req.method === 'GET') {
      res.writeHead(200);
      res.end(JSON.stringify({ success: true, reviews: dbReviews }));
      return;
    }

    // Default API Fallback
    res.writeHead(200);
    res.end(JSON.stringify({ status: 'online', service: 'DriveEase API v1.0' }));
    return;
  }

  // --- STATIC FILE SERVING ---
  let reqPath = decodeURI(pathname);
  if (reqPath === '/' || reqPath === '') {
    reqPath = '/index.html';
  }

  const filePath = path.join(PUBLIC_DIR, reqPath);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 Not Found</h1><p><a href="/">Go to DriveEase Home</a></p>', 'utf-8');
      } else {
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache'
      });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`DriveEase Server with REST API is actively running at http://localhost:${PORT}/`);
});
