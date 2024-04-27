package com.helloshoes.shoeshopmanagement.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "size")
public class Size implements SuperEntity {
    @Id
    private String sizeCode;
    private Integer size;

    @ManyToMany(mappedBy = "sizes")
    private List<Item> items;
}
