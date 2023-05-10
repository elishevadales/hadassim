import java.util.Scanner;

public class twitter {

	public static void main(String[] args) {
		// TODO Auto-generated method stub

		System.out.println("\nhey! welcome to twitter!");
		Scanner s = new Scanner(System.in);
		boolean start = true;
		
		while (start == true) {
			System.out.println("\nif you want to build a rectangular tower - please enter \"1\"\n"
					+ "if you want to build a triangle tower - please enter \"2\"\n"
					+ "to exit the system - enter \"3\"");

			int option = s.nextInt();
			
			switch (option) {
				case 1:
					rectangle();
					break;
				case 2:
					triangle();
					break;
				case 3:
					// Exit the system
					System.out.println("bye bye!");
					start = false;
					break;
				default:
					System.out.println("wrong option. please try again");
					continue;
			}
		}
	}
	
	
	
	public static void rectangle() {
		Scanner s = new Scanner(System.in);
		int rectangleWidth;
		int rectangleHeight;
		
		// Correct input is guaranteed, but I still preferred to add validation to the height of the tower
		do {
			System.out.println("please enter the height of the rectangle");
			rectangleHeight = s.nextInt();
			if (rectangleHeight < 2) {
				System.out.println("the height must be bigger than 1");
			}
		} while (rectangleHeight < 2);

		do {
			System.out.println("please enter the width of the rectangle");
			rectangleWidth = s.nextInt();
		} while (rectangleWidth < 0);
		
		if (rectangleHeight == rectangleWidth || Math.abs (rectangleHeight - rectangleWidth)  > 5) {
			int rectangleArea = rectangleHeight * rectangleWidth;
			System.out.println("The area of ​​this rectangle is " + rectangleArea);
		} else {
			int rectanglePerimeter = (2 * rectangleHeight) + (2 * rectangleWidth);
			System.out.println("The perimeter of this rectangle is " + rectanglePerimeter);
		}
	}
	
	
	
	
	public static void triangle() {
		Scanner s = new Scanner(System.in);
		int triangleWidth;
		int triangleHeight;
		// Correct input is guaranteed, but I still preferred to add validation to the
		// height of the tower
		System.out.println("please enter the height of the triangle");
		triangleHeight = s.nextInt();
		while (triangleHeight < 2) {
			System.out.println("the height must be bigger than 1. try again:");
			triangleHeight = s.nextInt();
		}

		do {
			System.out.println("please enter the width of the triangle");
			triangleWidth = s.nextInt();
		} while (triangleWidth < 0);

		System.out.println("to calculate the perimeter of the triangle - please enter \"1\"\n"
				+ "to print the triangle - please enter \"2\"");
		int option = s.nextInt();

		while (option > 2 || option < 1) {
			System.out.println("invalid option. please try again:");
			option = s.nextInt();
		}
		
		switch (option) {
			case 1:
				trianglePerimeter(triangleHeight,triangleWidth);
				break;
			case 2:
				printTriangle(triangleWidth,triangleHeight);
				break;
		}
	}
	
	
	
	
	public static void trianglePerimeter(int triangleHeight, int triangleWidth) {
		// pythagoras theorem
		double a = (double) triangleHeight;
		double b = (double) triangleWidth / 2;
		double c = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));

		double trianglePerimeter = 2 * c + triangleWidth;
		System.out.println("the perimeter of the triangle is " + trianglePerimeter);
	}
	
	
	
	
	public static void printTriangle(int triangleWidth,int triangleHeight) {
		if (triangleWidth % 2 == 0 || triangleWidth > 2 * triangleHeight || triangleWidth < 5) {
			System.out.println("We are sorry.this triangle cannot be printed.");
		} else if (triangleWidth % 2 != 0 && triangleWidth < 2 * triangleHeight) {
			System.out.println("let's print:");

			int numOfLineTypes = triangleWidth / 2 + 1;
			int numOfInnerLineTypes = numOfLineTypes - 2;
			int numOfInnerLines = triangleHeight - 2;
			int numOfLinesWhith3Dots = numOfInnerLines / numOfInnerLineTypes 
					+ numOfInnerLines % numOfInnerLineTypes;
			int numOfLinesForEveryLevel = numOfInnerLines / numOfInnerLineTypes;

			// print line 1
			print(' ',triangleWidth / 2);
			System.out.println("*");

			// print all "***" lines
			for (int i = 0; i < numOfLinesWhith3Dots; i++) {
				print(' ',triangleWidth / 2 - 1);
				System.out.println("***");
			}

			int numOfStars = 5; //this is the minimum stars that can be as the triangle width
			int numOfSpaces = triangleWidth / 2 - 2;

			// print the other lines except for the last one
			for (int j = 0; j < numOfLineTypes - 3; j++) {
				for (int w = 0; w < numOfLinesForEveryLevel; w++) {
					// print spaces
					print(' ',numOfSpaces);

					// print stars
					print('*',numOfStars);
					System.out.print("\n");
				}
				numOfSpaces--;
				numOfStars += 2;
			}

			// print the last line
			print('*',triangleWidth);
		}
	}
	
	
	
	
	public static void print(char ch, int num) {
		for (int i = 0; i < num; i++) {
			System.out.print(ch);
			
		}
	}
	

}
