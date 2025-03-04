import {
  Organization,
  User,
  InventoryItem,
  CustomField,
  CustomFieldValue,
  InsertOrganization,
  InsertUser,
  InsertInventoryItem,
  InsertCustomField,
} from "@shared/schema";

export interface IStorage {
  // Organization
  createOrganization(org: InsertOrganization): Promise<Organization>;
  getOrganization(id: number): Promise<Organization | undefined>;
  
  // User
  createUser(user: InsertUser): Promise<User>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUsersByOrganization(orgId: number): Promise<User[]>;
  
  // Inventory
  createInventoryItem(item: InsertInventoryItem): Promise<InventoryItem>;
  getInventoryItems(orgId: number): Promise<InventoryItem[]>;
  updateInventoryItem(id: number, item: Partial<InventoryItem>): Promise<InventoryItem>;
  deleteInventoryItem(id: number): Promise<void>;
  
  // Custom Fields
  createCustomField(field: InsertCustomField): Promise<CustomField>;
  getCustomFields(orgId: number, entityType: string): Promise<CustomField[]>;
  setCustomFieldValue(fieldId: number, entityId: number, value: string): Promise<CustomFieldValue>;
  getCustomFieldValues(entityId: number): Promise<CustomFieldValue[]>;
}

export class MemStorage implements IStorage {
  private organizations: Map<number, Organization>;
  private users: Map<number, User>;
  private inventory: Map<number, InventoryItem>;
  private customFields: Map<number, CustomField>;
  private customFieldValues: Map<number, CustomFieldValue>;
  private currentId: number;

  constructor() {
    this.organizations = new Map();
    this.users = new Map();
    this.inventory = new Map();
    this.customFields = new Map();
    this.customFieldValues = new Map();
    this.currentId = 1;
  }

  private nextId(): number {
    return this.currentId++;
  }

  // Organization
  async createOrganization(org: InsertOrganization): Promise<Organization> {
    const id = this.nextId();
    const organization = { id, ...org };
    this.organizations.set(id, organization);
    return organization;
  }

  async getOrganization(id: number): Promise<Organization | undefined> {
    return this.organizations.get(id);
  }

  // User
  async createUser(user: InsertUser): Promise<User> {
    const id = this.nextId();
    const newUser = { id, ...user };
    this.users.set(id, newUser);
    return newUser;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async getUsersByOrganization(orgId: number): Promise<User[]> {
    return Array.from(this.users.values()).filter(
      (user) => user.organizationId === orgId
    );
  }

  // Inventory
  async createInventoryItem(item: InsertInventoryItem): Promise<InventoryItem> {
    const id = this.nextId();
    const newItem = { id, ...item };
    this.inventory.set(id, newItem);
    return newItem;
  }

  async getInventoryItems(orgId: number): Promise<InventoryItem[]> {
    return Array.from(this.inventory.values()).filter(
      (item) => item.organizationId === orgId
    );
  }

  async updateInventoryItem(
    id: number,
    item: Partial<InventoryItem>
  ): Promise<InventoryItem> {
    const existing = this.inventory.get(id);
    if (!existing) throw new Error("Item not found");
    
    const updated = { ...existing, ...item };
    this.inventory.set(id, updated);
    return updated;
  }

  async deleteInventoryItem(id: number): Promise<void> {
    this.inventory.delete(id);
  }

  // Custom Fields
  async createCustomField(field: InsertCustomField): Promise<CustomField> {
    const id = this.nextId();
    const newField = { id, ...field };
    this.customFields.set(id, newField);
    return newField;
  }

  async getCustomFields(
    orgId: number,
    entityType: string
  ): Promise<CustomField[]> {
    return Array.from(this.customFields.values()).filter(
      (field) =>
        field.organizationId === orgId && field.entityType === entityType
    );
  }

  async setCustomFieldValue(
    fieldId: number,
    entityId: number,
    value: string
  ): Promise<CustomFieldValue> {
    const id = this.nextId();
    const fieldValue = {
      id,
      customFieldId: fieldId,
      entityId,
      value,
    };
    this.customFieldValues.set(id, fieldValue);
    return fieldValue;
  }

  async getCustomFieldValues(entityId: number): Promise<CustomFieldValue[]> {
    return Array.from(this.customFieldValues.values()).filter(
      (value) => value.entityId === entityId
    );
  }
}

export const storage = new MemStorage();
