package jpabook.jpabasic.domain;


import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@Entity
public class Food extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Long id;

    @Column(nullable = false,unique = true)
    private String name;

    @Column(nullable = false)
    private Integer calories;

    @Column(nullable = false)
    private String iconKey;

    private String category;

    @Builder
    public Food(String name, Integer calories, String iconKey, String category) {
        this.name = name;
        this.calories = calories;
        this.iconKey = iconKey;
        this.category = category;
    }


}
