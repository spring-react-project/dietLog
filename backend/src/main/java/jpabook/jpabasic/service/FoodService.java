package jpabook.jpabasic.service;


import jpabook.jpabasic.domain.Food;
import jpabook.jpabasic.repository.FoodRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FoodService {

    public final FoodRepository foodRepository;

    public Food getById(Long id) {
        return foodRepository.findById(id)
                .orElseThrow(()->new IllegalArgumentException("Food not found:"+id));
    }

    public Optional<Food> findByName(String name) {
        return foodRepository.findByName(name);
    }

    @Transactional
    public Food createOrGetExisting(String name, Integer calories, String iconKey, String category) {
        // 이미 존재하는 음식인지 확인
        Optional<Food> existingFood = foodRepository.findByName(name);
        if (existingFood.isPresent()) {
            return existingFood.get();
        }

        // 존재하지 않으면 새로 생성
        Food food = Food.builder()
                .name(name)
                .calories(calories)
                .iconKey(iconKey)
                .category(category)
                .build();

        return foodRepository.save(food);
    }
}
