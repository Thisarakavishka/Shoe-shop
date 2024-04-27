package com.helloshoes.shoeshopmanagement.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "item_colour")
public class ItemColour implements SuperEntity {
    @Id
    private String id;
    private String imgPath;

    @ManyToOne
    @JoinColumn(name = "item_id")
    private Item item;

    @ManyToOne
    @JoinColumn(name = "colour_id")
    private Colour colour;
}
