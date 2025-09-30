---
slug: genetic-programming-mona-lisa-faq
title: "Genetic Programming: Mona Lisa FAQ"
authors: [rogerjohansson]
tags: []
---
This is a follow up to: [http://rogeralsing.com/2008/12/07/genetic-programming-evolution-of-mona-lisa/](http://rogeralsing.com/2008/12/07/genetic-programming-evolution-of-mona-lisa/)

<!-- truncate -->

### Mona Lisa FAQ

Here are some answers to the most frequently asked questions:

**Q) What is the use for this? this is nothing but a fun toy**

A\) Exactly… It was a 3 hours fun hack for my friends and readers… 

**Q) What is your population size?**

A\) TWO , Parent and Child is competing against eachother each generation.

**Q) Is this Genetic Programming?, I think it is a GA or even a hill climbing algorithm.**

A\) I will claim that this is a GP due to the fact that the application clones and mutates an executable Abstract Syntax Tree (AST).

Even if the population is small, there is still competition between the parent and the child, the best fit of the two will survive.

Sample:

```text
Drawing

    DrawPolygon (
       Brush(10,30,50,30),
       Point(554,93) , Point(675,45) , Point (2345,5356) , Point(4,5)
    )

    DrawPolygon (
       Brush(50,1,43,66),
       Point(66,112) , Point(12,99) , Point (542,8756)
    )

    DrawPolygon (
        Brush(32,100,22,87),
        //dynamic number of points
        Point(423,342) , Point(3,432) , Point (12354,1234) , Point (0,23)
    )

end
```

**Q) What is your fitness function?**

A\) The fitness function is a pixel by pixel compare where the fitness for each pixel is summed and compared to the parent.

Pseudo Sample:

```text
double fitness = 0
for y = 0 to width
    for x = 0 to height
          color c1 = GetPixel(sourceImage, x, y)
          color c2 = GetPixel(generatedImage, x, y)

          //get delta per color
          double deltaRed = c1.Red - c2.Red
          double deltaGreen = c1.Green - c2.Green
          double deltaBlue = c1.Blue - c2.Blue

          // measure the distance between the colors in 3D space
          double pixelFitness = deltaRed * deltaRed +
                                deltaGreen * deltaGreen +
                                deltaBlue * deltaBlue 

          //add the pixel fitness to the total fitness ( lower is better )
          fitness += pixelFitness
    end
end

return fitness
```

**Q) How long did the generation take?**

A\) About 3 hours on my laptop.

**Q) Where can I get the source code?**

A\) Here: [http://rogeralsing.com/2008/12/11/genetic-programming-mona-lisa-source-code-and-binaries/](http://rogeralsing.com/2008/12/11/genetic-programming-mona-lisa-source-code-and-binaries/)

**Adding more soon….**
