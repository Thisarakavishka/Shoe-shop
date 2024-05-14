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
@Table(name = "item_details")
public class ItemDetails implements SuperEntity {
    @Id
    private String id;
    private Integer qty;

    @ManyToOne
    @JoinColumn(name = "item_id")
    @JsonBackReference
    private Item item;

    @ManyToOne
    @JoinColumn(name = "colour_id")
    @JsonBackReference
    private Colour colour;

    @ManyToOne
    @JoinColumn(name = "type_id")
    @JsonBackReference
    private Type type;

    @ManyToOne
    @JoinColumn(name = "category_id")
    @JsonBackReference
    private Category category;

    @ManyToOne
    @JoinColumn(name = "size_id")
    @JsonBackReference
    private Size size;
}
