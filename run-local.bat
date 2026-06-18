@echo off
echo ==========================================
echo Starting CineVerse Services in Dev Mode...
echo ==========================================

echo Starting Gateway Service on port 8080...
start "Gateway Service" cmd /k "cd backend\gateway && mvnw.cmd spring-boot:run"

echo Starting Auth Service on port 8081...
start "Auth Service" cmd /k "cd backend\auth-service && mvnw.cmd spring-boot:run"

echo Starting Movie Service on port 8082...
start "Movie Service" cmd /k "cd backend\movie-service && mvnw.cmd spring-boot:run"

echo Starting Review Service on port 8083...
start "Review Service" cmd /k "cd backend\review-service && mvnw.cmd spring-boot:run"

echo Starting Frontend on port 3000...
start "Frontend Client" cmd /k "cd frontend && npm run dev"

echo ==========================================
echo All services have been launched in separate terminal windows.
echo Gateway API: http://localhost:8080
echo Frontend: http://localhost:3000
echo ==========================================
