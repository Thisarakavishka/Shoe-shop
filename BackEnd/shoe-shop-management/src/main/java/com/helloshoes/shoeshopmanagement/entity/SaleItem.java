package com.helloshoes.shoeshopmanagement.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "sale_item")
public class SaleItem {
    @Id
    private String id;
    private Integer qty;

    @ManyToOne
    @JoinColumn(name = "sale_id")
    @JsonBackReference
    private Sales sale;
    @ManyToOne
    @JoinColumn(name = "item_id")
    @JsonBackReference
    private Item item;

    @ManyToOne
    @JoinColumn(name = "size_id")
    @JsonBackReference
    private Size size;

    @ManyToOne
    @JoinColumn(name = "colour_id")
    @JsonBackReference
    private Colour colour;
}
