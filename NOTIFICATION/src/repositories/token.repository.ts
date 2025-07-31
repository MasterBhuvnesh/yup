import * as admin from 'firebase-admin';

import db from '@/config/firebase';
import { Token, CreateTokenRequest, TokenDocument } from '@/models/token.model';
import { DatabaseError } from '@/utils/errors/custom-errors';
import { logger } from '@/utils/logger';

import { ITokenRepository } from './interfaces/token.repository.interface';

/**
 * Firebase implementation of Token Repository
 */
export class TokenRepository implements ITokenRepository {
  private readonly collection = db.collection('tokens');

  /**
   * Store a new token in Firestore
   * @param tokenData - The token data to store
   * @returns Promise resolving to the stored token
   * @throws DatabaseError when storage fails
   */
  async createToken(tokenData: CreateTokenRequest): Promise<Token> {
    try {
      const tokenDoc: TokenDocument = {
        token: tokenData.token,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      const tokenRef = this.collection.doc(tokenData.token);
      await tokenRef.set(tokenDoc);

      logger.log(`Token stored successfully: ${tokenData.token}`);

      return {
        token: tokenData.token,
        createdAt: new Date(),
      };
    } catch (error) {
      logger.error('Error storing token:', error);
      throw new DatabaseError('Failed to store token');
    }
  }

  /**
   * Retrieve all tokens from Firestore
   * @returns Promise resolving to array of token strings
   * @throws DatabaseError when retrieval fails
   */
  async getAllTokens(): Promise<string[]> {
    try {
      const tokensSnapshot = await this.collection.get();
      
      if (tokensSnapshot.empty) {
        return [];
      }

      const tokens: string[] = [];
      tokensSnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.token) {
          tokens.push(data.token);
        }
      });

      logger.log(`Retrieved ${tokens.length} tokens`);
      return tokens;
    } catch (error) {
      logger.error('Error retrieving tokens:', error);
      throw new DatabaseError('Failed to retrieve tokens');
    }
  }

  /**
   * Check if a token exists in the database
   * @param token - The token to check
   * @returns Promise resolving to boolean indicating existence
   * @throws DatabaseError when check fails
   */
  async tokenExists(token: string): Promise<boolean> {
    try {
      const doc = await this.collection.doc(token).get();
      return doc.exists;
    } catch (error) {
      logger.error('Error checking token existence:', error);
      throw new DatabaseError('Failed to check token existence');
    }
  }
}