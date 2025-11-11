#!/usr/bin/env tsx

/**
 * Script to create an admin user for the digital garden
 * Usage: npm run create-user
 *
 * You'll be prompted for email and password
 */

import { getDb, initializeDb } from '../lib/db';
import { hashPassword } from '../lib/auth';
import * as readline from 'readline';

function generateId() {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

async function createUser(email: string, password: string) {
  const db = getDb();
  await initializeDb();

  const hashedPassword = await hashPassword(password);
  const id = generateId();
  const now = new Date().toISOString();

  try {
    await db.execute({
      sql: `
        INSERT INTO User (id, email, password, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?)
      `,
      args: [id, email, hashedPassword, now, now]
    });

    console.log('✅ User created successfully!');
    console.log(`Email: ${email}`);
  } catch (error: any) {
    if (error.message?.includes('UNIQUE constraint failed')) {
      console.error('❌ Error: A user with this email already exists.');
    } else {
      console.error('❌ Error creating user:', error);
    }
    process.exit(1);
  }
}

function promptInput(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

async function main() {
  console.log('=== Create Admin User ===\n');

  const email = await promptInput('Email: ');
  const password = await promptInput('Password: ');

  if (!email || !password) {
    console.error('❌ Email and password are required');
    process.exit(1);
  }

  // Basic email validation
  if (!email.includes('@')) {
    console.error('❌ Invalid email format');
    process.exit(1);
  }

  if (password.length < 6) {
    console.error('❌ Password must be at least 6 characters');
    process.exit(1);
  }

  await createUser(email, password);
}

main().catch((error) => {
  console.error('❌ Unexpected error:', error);
  process.exit(1);
});
