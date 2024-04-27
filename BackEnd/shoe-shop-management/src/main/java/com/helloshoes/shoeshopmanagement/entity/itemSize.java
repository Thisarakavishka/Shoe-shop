package com.helloshoes.shoeshopmanagement.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "item_size")
public class itemSize implements SuperEntity {
    @Id
    private String id;
    private Double salePrice;
    private Double buyPrice;

    @ManyToOne
    @JoinColumn(name = "item_id")
    private Item item;

    @ManyToOne
    @JoinColumn(name = "size_id")
    private Size size;
}
