import { TokenService } from '../services/token.service';
import { ValidationError } from '../utils/errors/custom-errors';

// Mock the repository
jest.mock('../repositories/token.repository');

describe('TokenService', () => {
  let tokenService: TokenService;
  let mockRepository: any;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Create mock repository
    mockRepository = {
      createToken: jest.fn(),
      getAllTokens: jest.fn(),
      tokenExists: jest.fn(),
    };
    
    tokenService = new TokenService(mockRepository);
  });

  describe('validateTokenData', () => {
    it('should throw ValidationError for missing token data', () => {
      expect(() => tokenService.validateTokenData(null as any)).toThrow(ValidationError);
      expect(() => tokenService.validateTokenData(undefined as any)).toThrow(ValidationError);
    });

    it('should throw ValidationError for missing token', () => {
      expect(() => tokenService.validateTokenData({} as any)).toThrow(ValidationError);
      expect(() => tokenService.validateTokenData({ token: '' })).toThrow(ValidationError);
    });

    it('should throw ValidationError for invalid token type', () => {
      expect(() => tokenService.validateTokenData({ token: 123 } as any)).toThrow(ValidationError);
    });

    it('should throw ValidationError for invalid Expo token format', () => {
      expect(() => tokenService.validateTokenData({ token: 'invalid-token' })).toThrow(ValidationError);
    });

    it('should pass validation for valid Expo token', () => {
      expect(() => tokenService.validateTokenData({ token: 'ExponentPushToken[ABC123]' })).not.toThrow();
      expect(() => tokenService.validateTokenData({ token: 'ExpoPushToken[XYZ789]' })).not.toThrow();
    });
  });

  describe('registerToken', () => {
    it('should register a new token when it does not exist', async () => {
      const tokenData = { token: 'ExponentPushToken[ABC123]' };
      const expectedToken = { token: tokenData.token, createdAt: new Date() };
      
      mockRepository.tokenExists.mockResolvedValue(false);
      mockRepository.createToken.mockResolvedValue(expectedToken);

      const result = await tokenService.registerToken(tokenData);

      expect(mockRepository.tokenExists).toHaveBeenCalledWith(tokenData.token);
      expect(mockRepository.createToken).toHaveBeenCalledWith(tokenData);
      expect(result).toEqual(expectedToken);
    });

    it('should return existing token info when token already exists', async () => {
      const tokenData = { token: 'ExponentPushToken[ABC123]' };
      
      mockRepository.tokenExists.mockResolvedValue(true);

      const result = await tokenService.registerToken(tokenData);

      expect(mockRepository.tokenExists).toHaveBeenCalledWith(tokenData.token);
      expect(mockRepository.createToken).not.toHaveBeenCalled();
      expect(result.token).toBe(tokenData.token);
    });
  });

  describe('getAllTokens', () => {
    it('should return all tokens from repository', async () => {
      const expectedTokens = ['ExponentPushToken[ABC123]', 'ExpoPushToken[XYZ789]'];
      mockRepository.getAllTokens.mockResolvedValue(expectedTokens);

      const result = await tokenService.getAllTokens();

      expect(mockRepository.getAllTokens).toHaveBeenCalled();
      expect(result).toEqual(expectedTokens);
    });
  });
});