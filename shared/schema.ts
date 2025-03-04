import { z } from "zod";
import { createInsertSchema } from "drizzle-zod";

// Organization and User Management
export interface Organization {
  id: number;
  name: string;
}

export interface User {
  id: number;
  organizationId: number;
  username: string;
  password: string;
  role: 'admin' | 'user';
}

export const insertOrganizationSchema = z.object({
  name: z.string().min(1),
});

export const insertUserSchema = z.object({
  organizationId: z.number(),
  username: z.string().min(3),
  password: z.string().min(6),
  role: z.enum(['admin', 'user']),
});

// Inventory Management
export interface InventoryItem {
  id: number;
  organizationId: number;
  name: string;
  sku: string;
  quantity: number;
  unit: string;
  type: 'ingredient' | 'component' | 'product';
}

export const insertInventoryItemSchema = z.object({
  organizationId: z.number(),
  name: z.string().min(1),
  sku: z.string().min(1),
  quantity: z.number().min(0),
  unit: z.string().min(1),
  type: z.enum(['ingredient', 'component', 'product']),
});

// Expense Tracking
export interface Expense {
  id: number;
  organizationId: number;
  description: string;
  amount: number;
  date: string;
  category: string;
}

export const insertExpenseSchema = z.object({
  organizationId: z.number(),
  description: z.string().min(1),
  amount: z.number().min(0),
  date: z.string(),
  category: z.string().min(1),
});

// Custom Fields
export interface CustomField {
  id: number;
  organizationId: number;
  entityType: string;
  name: string;
  type: 'text' | 'number' | 'boolean' | 'date';
}

export interface CustomFieldValue {
  id: number;
  customFieldId: number;
  entityId: number;
  value: string;
}

export const insertCustomFieldSchema = z.object({
  organizationId: z.number(),
  entityType: z.string().min(1),
  name: z.string().min(1),
  type: z.enum(['text', 'number', 'boolean', 'date']),
});

export type InsertOrganization = z.infer<typeof insertOrganizationSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertInventoryItem = z.infer<typeof insertInventoryItemSchema>;
export type InsertExpense = z.infer<typeof insertExpenseSchema>;
export type InsertCustomField = z.infer<typeof insertCustomFieldSchema>;
