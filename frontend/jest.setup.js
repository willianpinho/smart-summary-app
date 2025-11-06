// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'
import { TextEncoder, TextDecoder } from 'util'

// Polyfill TextEncoder/TextDecoder for Node environment
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

// Mock react-markdown and remark-gfm to avoid ESM issues in Jest
jest.mock('react-markdown', () => ({
  __esModule: true,
  default: ({ children }) => children,
}))

jest.mock('remark-gfm', () => ({
  __esModule: true,
  default: () => {},
}))
