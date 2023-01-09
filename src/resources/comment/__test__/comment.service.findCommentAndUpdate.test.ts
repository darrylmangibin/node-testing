import PostFactory from '@/resources/post/post.factory';
import UserFactory from '@/resources/user/user.factory';
import ErrorException from '@/utils/exceptions/error.exception';
import { faker } from '@faker-js/faker';
import { Error, Types } from 'mongoose';
import CommentFactory from '../comment.factory';
import CommentService from '../comment.service';

describe('CommentService findCommentAndUpdate', () => {
  it('should throw 404 error', async () => {
    try {
      await new CommentService().findCommentAndUpdate(new Types.ObjectId().toString(), {
        body: faker.lorem.paragraph(),
      });
    } catch (error) {
      expect(error).toBeInstanceOf(ErrorException);
    }
  });

  it('should throw 422 error', async () => {
    try {
      const comment = await new CommentFactory().create();
      await new CommentService().findCommentAndUpdate(comment.id, {
        body: '',
      });
    } catch (error) {
      expect(error).toBeInstanceOf(Error.ValidationError);
    }
  });

  it('should return updated comment', async () => {
    const comment = await new CommentFactory().create();

    const input = {
      body: faker.lorem.paragraph(),
    };

    const updatedComment = await new CommentService().findCommentAndUpdate(
      comment.id,
      input
    );

    expect(updatedComment).toEqual(
      expect.objectContaining({
        body: input.body,
      })
    );
  });
});
