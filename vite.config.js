import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages 배포 시: https://<사용자명>.github.io/<저장소명>/ 형태이므로
// base를 저장소명으로 맞춰야 합니다. 저장소명을 바꾸면 아래도 바꾸세요.
export default defineConfig({
  plugins: [react()],
  base: '/nomu-guide/',
})
