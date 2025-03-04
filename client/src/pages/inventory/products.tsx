// Similar to ingredients.tsx but with type="product"
// Only showing the differences to avoid repetition
export default function InventoryProducts() {
  // ... other code remains the same ...

  const { data: items, isLoading } = useQuery<InventoryItem[]>({
    queryKey: [`/api/organizations/${user?.organizationId}/inventory`],
    enabled: !!user,
    select: (data) => data.filter(item => item.type === 'product'),
  });

  const form = useForm<InventoryFormValues>({
    resolver: zodResolver(insertInventoryItemSchema),
    defaultValues: {
      organizationId: user?.organizationId,
      name: "",
      sku: "",
      quantity: 0,
      unit: "",
      type: "product", // Set to product for this page
    },
  });

  // ... rest of the code remains the same, just change labels from "Ingredient" to "Product" ...
}
