package com.helloshoes.shoeshopmanagement.entity;

import com.helloshoes.shoeshopmanagement.entity.enums.ShoeGender;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "item")
@ToString(exclude = {"suppliers", "sizes", "colours", "itemDetails", "refunds", "sales"})
public class Item implements SuperEntity {
    @Id
    private String itemCode;
    private String itemName;
    private Double expectedProfit;
    private Double profitMargin;
    @Enumerated(EnumType.STRING)
    private ShoeGender shoeGender;

    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(name = "item_supplier",
            joinColumns = @JoinColumn(name = "item_id"),
            inverseJoinColumns = @JoinColumn(name = "supplier_id"))
    private List<Supplier> suppliers;

    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(name = "item_size",
            joinColumns = @JoinColumn(name = "item_id"),
            inverseJoinColumns = @JoinColumn(name = "size_id"))
    private List<Size> sizes;

    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(name = "item_category",
            joinColumns = @JoinColumn(name = "item_id"),
            inverseJoinColumns = @JoinColumn(name = "category_id"))
    private List<Category> categories;

    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(name = "item_type",
            joinColumns = @JoinColumn(name = "item_id"),
            inverseJoinColumns = @JoinColumn(name = "type_id"))
    private List<Type> types;

    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(name = "item_colour",
            joinColumns = @JoinColumn(name = "item_id"),
            inverseJoinColumns = @JoinColumn(name = "colour_id"))
    private List<Colour> colours;

    @OneToMany(mappedBy = "item")
    private List<ItemDetails> itemDetails;

    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(name = "item_refund",
            joinColumns = @JoinColumn(name = "item_id"),
            inverseJoinColumns = @JoinColumn(name = "refund_id"))
    private List<Refund> refunds;

    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(name = "sales_item",
            joinColumns = @JoinColumn(name = "item_id"),
            inverseJoinColumns = @JoinColumn(name = "sale_id"))
    private List<Sales> sales;
}
