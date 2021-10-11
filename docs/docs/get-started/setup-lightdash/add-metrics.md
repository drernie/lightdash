---
sidebar_position: 3
sidebar_label: Create first metrics
---

# Create your first metrics

You must define **metrics** and **dimensions** before you can start exploring and visualizing data with Lightdash. 
Metrics are simpler alternative to exploring raw data, read more on the [the Lightdash approach to BI](../../best-practice/lightdashWay.md)

For each model in your dbt project, you may define many dimensions and metrics:
* **Dimensions** are used to **segment data** in your models
* **Metrics** are used to **perform calculations** on your data models

Dimensions and metrics are defined in your `schema.yml` alongside your dbt models.

## 1. Add a dimension to your project

Dimensions are created automatically when you define columns in your dbt models. To define columns add a new `.yml` 
file to your `models/` directory in your dbt project.

For example, the following `schema.yml` file would create a single dimension for the `orders` model in Lightdash:

```yaml
# schema.yml
version: 2

models:
  - name: orders
    description: "A table of all orders."
    
    columns:
      - name: status
        description: "Status of an order: ordered/processed/complete"
```

The name of the dimension is `status` and the type will be inferred from the column in your database.

## 2. Add a metric to your project

Metrics are defined in your `schema.yml` files along with your dimensions and dbt models.

If dimensions segment your data into groups, metrics calculate interesting statistics for those groups. 

For example, once we've used the `status` dimension to split orders by their `status`, we may want to know the 
"Total number of orders" or the "Total sales" of the orders. These calculations are metrics:

```yaml
# schema.yml
version: 2

models:
  - name: "orders"
    description: "A table of all orders."
    
    columns:
      - name: "status"
        description: "Status of an order: ordered/processed/complete"
        
      - name: "order_id"
        meta:
          metrics:
            total_order_count:
              type: "count_distinct" 
              
      - name: "order_value"
        meta:
          metrics:
            total_sales:
              type: "sum" 
```

## 3. Load your metrics in Lightdash

Commit the new `schema.yml` files containing your dimensions and metrics to your dbt project:

* Github/Gitlab: commit the `schema.yml` files and push them to the branch connected with Lightdash.
* dbt Cloud: hit save on the `schema.yml` files in the dbt Cloud UI
* local dbt project: save the new `schema.yml` files

Finally hit "Refresh dbt" in the Lightdash UI to check your metrics for errors and load them into Lightdash.
