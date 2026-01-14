package jpabook.jpabasic.service;


import jpabook.jpabasic.domain.Food;
import jpabook.jpabasic.repository.FoodRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FoodService {

    public final FoodRepository foodRepository;

    public Food getById(Long id) {
        return foodRepository.findById(id)
                .orElseThrow(()->new IllegalArgumentException("Food not found:"+id));
    }
}
