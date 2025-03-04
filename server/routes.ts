import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertOrganizationSchema, insertUserSchema, insertInventoryItemSchema, insertCustomFieldSchema } from "@shared/schema";

export async function registerRoutes(app: Express) {
  const server = createServer(app);

  // Organizations
  app.post("/api/organizations", async (req, res) => {
    try {
      const data = insertOrganizationSchema.parse(req.body);
      const org = await storage.createOrganization(data);
      res.json(org);
    } catch (error) {
      res.status(400).json({ error: String(error) });
    }
  });

  app.get("/api/organizations/:id", async (req, res) => {
    const org = await storage.getOrganization(Number(req.params.id));
    if (!org) {
      res.status(404).json({ error: "Organization not found" });
      return;
    }
    res.json(org);
  });

  // Users
  app.post("/api/users", async (req, res) => {
    try {
      const data = insertUserSchema.parse(req.body);
      const user = await storage.createUser(data);
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: String(error) });
    }
  });

  app.post("/api/login", async (req, res) => {
    const { username, password } = req.body;
    const user = await storage.getUserByUsername(username);
    
    if (!user || user.password !== password) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    res.json({ user });
  });

  // Inventory
  app.get("/api/organizations/:orgId/inventory", async (req, res) => {
    const items = await storage.getInventoryItems(Number(req.params.orgId));
    res.json(items);
  });

  app.post("/api/inventory", async (req, res) => {
    try {
      const data = insertInventoryItemSchema.parse(req.body);
      const item = await storage.createInventoryItem(data);
      res.json(item);
    } catch (error) {
      res.status(400).json({ error: String(error) });
    }
  });

  app.patch("/api/inventory/:id", async (req, res) => {
    try {
      const item = await storage.updateInventoryItem(Number(req.params.id), req.body);
      res.json(item);
    } catch (error) {
      res.status(400).json({ error: String(error) });
    }
  });

  app.delete("/api/inventory/:id", async (req, res) => {
    try {
      await storage.deleteInventoryItem(Number(req.params.id));
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: String(error) });
    }
  });

  // Custom Fields
  app.post("/api/custom-fields", async (req, res) => {
    try {
      const data = insertCustomFieldSchema.parse(req.body);
      const field = await storage.createCustomField(data);
      res.json(field);
    } catch (error) {
      res.status(400).json({ error: String(error) });
    }
  });

  app.get("/api/organizations/:orgId/custom-fields", async (req, res) => {
    const { entityType } = req.query;
    if (typeof entityType !== "string") {
      res.status(400).json({ error: "entityType is required" });
      return;
    }
    
    const fields = await storage.getCustomFields(
      Number(req.params.orgId),
      entityType
    );
    res.json(fields);
  });

  app.post("/api/custom-fields/:fieldId/values", async (req, res) => {
    try {
      const { entityId, value } = req.body;
      const fieldValue = await storage.setCustomFieldValue(
        Number(req.params.fieldId),
        entityId,
        value
      );
      res.json(fieldValue);
    } catch (error) {
      res.status(400).json({ error: String(error) });
    }
  });

  return server;
}
